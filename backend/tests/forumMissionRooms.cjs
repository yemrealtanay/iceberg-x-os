module.exports = async ({db, chat, cube, other, staff}) => {
  const assert = require('node:assert/strict');
  const {missionRoom, reconcileMissionRoomsNow} = require('../dist/services/forumMissionRoom.service');
  const mission = await db.mission.create({data:{title:'Mission room regression',description:'QA',context:'QA',problem_statement:'QA',expected_output:'QA',difficulty_level:'Level_4_Integration_Candidate',created_by_id:staff.id}});
  const profile = await db.cubeProfile.findUnique({where:{user_id:cube.id}});
  const otherProfile = await db.cubeProfile.findUnique({where:{user_id:other.id}});
  const team = await db.missionTeam.create({data:{name:'Room regression',mission_id:mission.id,members:{create:{cube_id:profile.id}}}});
  await assert.rejects(missionRoom(cube,mission.id,true), e=>e.status===403);
  const {room} = await missionRoom(staff,mission.id,true);
  assert.equal((await missionRoom(staff,mission.id,true)).room.id,room.id);
  assert.ok((await missionRoom(cube,mission.id)).room);
  // A steady-state check is read-only: the sealed name (random IV) is not rewritten on every request.
  const sealed = (await db.forumChatRoom.findUnique({where:{id:room.id}})).name;
  await missionRoom(cube,mission.id); await reconcileMissionRoomsNow();
  assert.equal((await db.forumChatRoom.findUnique({where:{id:room.id}})).name, sealed);
  assert.equal((await missionRoom(other,mission.id)).room,null);
  await chat.sendChatMessage(staff,room.id,{body:'History stays visible to new assignees.'});
  await db.missionTeamMember.create({data:{team_id:team.id,cube_id:otherProfile.id}});
  assert.ok((await missionRoom(other,mission.id)).room);
  await chat.chatMessages(other,room.id,1);
  await db.missionTeamMember.deleteMany({where:{team_id:team.id,cube_id:otherProfile.id}});
  // The background pass drops removed assignees from room lists without any room request.
  await reconcileMissionRoomsNow();
  assert.equal(await db.forumChatMember.count({where:{room_id:room.id,user_id:other.id}}),0);
  assert.ok(!(await chat.listChatRooms(other,1)).rooms.some(r=>r.id===room.id));
  await assert.rejects(chat.chatMessages(other,room.id,1), e=>e.status===404);
  await assert.rejects(chat.withChatMember(other,room.id,async()=>true), e=>e.status===404);
  await assert.rejects(chat.addChatMembers(staff,room.id,{user_ids:[other.id]}),e=>e.status===403);
  await db.mission.update({where:{id:mission.id},data:{title:'Renamed mission'}});
  assert.equal((await chat.chatRoomDetails(staff,room.id)).name,'Renamed mission');
  const privateRoom = await chat.createChatRoom(cube,{name:'Stable roster regression',member_ids:[other.id]});
  await assert.rejects(chat.chatRoomDetails(staff,privateRoom.id),e=>e.status===404);
  await chat.setChatMemberRole(cube,privateRoom.id,other.id,{role:'ADMIN'});
  await db.forumChatMember.updateMany({where:{room_id:privateRoom.id},data:{joined_at:new Date('2026-11-19T12:00:00Z')}});
  const expected=(await chat.chatRoomDetails(cube,privateRoom.id)).members.map(m=>m.id);
  for(let i=0;i<10;i++) assert.deepEqual((await chat.chatRoomDetails(cube,privateRoom.id)).members.map(m=>m.id),expected);
  // /admin/ops: open rooms for active missions with an active Cube, once.
  const {createRoomsForActiveMissions} = require('../dist/services/forumMissionRoom.service');
  const make = async (title, status, withCube) => {
    const m = await db.mission.create({data:{title,description:'QA',context:'QA',problem_statement:'QA',expected_output:'QA',difficulty_level:'Level_4_Integration_Candidate',created_by_id:staff.id,status}});
    if (withCube) await db.missionTeam.create({data:{name:`${title} team`,mission_id:m.id,members:{create:{cube_id:profile.id}}}});
    return m;
  };
  const active = await make('Ops active mission', 'researching', true);
  await make('Ops completed mission', 'completed', true);
  await make('Ops mission without Cubes', 'building_demo', false);
  const first = await createRoomsForActiveMissions(staff.id);
  const titles = first.rooms.map(r => r.mission);
  assert.ok(titles.includes('Ops active mission'));
  assert.ok(!titles.includes('Ops completed mission') && !titles.includes('Ops mission without Cubes'));
  assert.equal(first.failed, 0);
  const opened = await db.forumChatRoom.findUnique({where:{mission_id:active.id},include:{members:true}});
  assert.equal(opened.members.find(m=>m.user_id===cube.id)?.role, 'MEMBER');
  assert.equal(opened.members.find(m=>m.user_id===staff.id)?.role, 'ADMIN');
  assert.equal(first.rooms.find(r=>r.mission==='Ops active mission').cubes, 1);
  const second = await createRoomsForActiveMissions(staff.id);
  assert.equal(second.created, 0);
  assert.ok(second.already_had_room >= 1);
  assert.equal(await db.forumChatRoom.count({where:{mission_id:active.id}}), 1);
  // Room header: the mission's mentor and its active Cubes, not every staff member in the room.
  await db.mission.update({where:{id:active.id},data:{mentor_id:staff.id}});
  const teamView = (await chat.chatRoomDetails(cube, opened.id)).mission_team;
  assert.equal(teamView.mentor.id, staff.id);
  assert.deepEqual(teamView.cubes.map(c=>c.id), [cube.id]);
  assert.ok(teamView.cubes[0].team_role);
  assert.equal((await chat.chatRoomDetails(cube, privateRoom.id)).mission_team, null);
  console.log('PASS: ops opens rooms only for active missions with Cubes, and a re-run changes nothing.');
  console.log('PASS: mission room creation, roster joins/revocation, private isolation, rename and stable two-admin order.');
};
