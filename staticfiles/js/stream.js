
const APP_ID= '6cc682162c644073bf5e4aede97b7ffd'
let NAME = sessionStorage.getItem('name')
const CHANNEL =sessionStorage.getItem('room')
let UID = Number(sessionStorage.getItem('UID'))

const client = AgoraRTC.createClient({mode:'rtc',codec:'vp8'})
 const TOKEN= sessionStorage.getItem('Token')
let localTracks  =[]
let remoteUsers ={}

let joinAndDisplayLocalStream = async()=> {
    document.getElementById('roomname').innerText= CHANNEL

    client.on('user-published',handleUserJoined)
    client.on('user-left',handleUserLeft)
    try{
        await client.join(APP_ID, CHANNEL, TOKEN, UID)
    }
    catch(error){
        console.error(error)
        window.open('/','_self')
    }
let member = await createMember()
    localTracks = await AgoraRTC.createMicrophoneAndCameraTracks()

    let player = `<div class="video-container" id="user-container-${UID}">
            <div class="username-wrapper"><span class="user-name" style="font-family: 'Russo One', sans-serif">${member.name}</span></div>
            <div class="video-player" id="user-${UID}"></div>
        </div>`
    document.getElementById('video-streams').insertAdjacentHTML('beforeend',player)


    localTracks[1].play(`user-${UID}`)

    await client.publish([localTracks[0],localTracks[1]])
}

let handleUserJoined = async(user,mediaType)=>{
    remoteUsers[user.uid] = user
    await client.subscribe(user,mediaType)

    if(mediaType === 'video'){
        let player = document.getElementById(`user-container-${user.uid}`)
        if(player != null){
            player.remove()
        }
        let member = await getMember(user)
        player = `<div class="video-container" id="user-container-${user.uid}">
            <div class="username-wrapper"><span class="user-name">${member.name}</span></div>
            <div class="video-player" id="user-${user.uid}"></div>
        </div>`
    document.getElementById('video-streams').insertAdjacentHTML('beforeend',player)
        user.videoTrack.play(`user-${user.uid}`)
    }
    if(mediaType === 'audio'){
        user.audioTrack.play()
    }
}
let handleUserLeft = async(user)=>{
    delete remoteUsers[user.uid]
    document.getElementById(`user-container-${user.uid}`).remove()
}



let LeaveAndRemoveLocalStream = async()=>{
    for(let i=0;i<localTracks.length;i++){
        localTracks[i].stop()
        localTracks[i].close()
    }
    await client.leave()
    await deleteMember()
    window.open('/','_self')
}

let turnOffCamera = async(e) =>{
    if(localTracks[1].muted){
        await localTracks[1].setMuted(false)
        e.target.style.backgroundColor=  '#fff'
    }
    else{
        await localTracks[1].setMuted(true)
        e.target.style.backgroundColor= 'rgb(255, 80, 80, 1)'
    }
}
let turnOffMic = async(e) =>{
    if(localTracks[0].muted){
        await localTracks[0].setMuted(false)
        e.target.style.backgroundColor=  '#fff'
    }
    else{
        await localTracks[0].setMuted(true)
        e.target.style.backgroundColor=  'rgb(255, 80, 80, 1)'
    }
}

let createMember = async () => {
    let response = await fetch('/create_member/', {
        method:'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body:JSON.stringify({'name':NAME, 'room_name':CHANNEL, 'UID':UID})
    })
    let member = await response.json()
    return member
}
let getMember = async (user) => {
    let response = await fetch(`/get_member/?UID=${user.uid}&room_name=${CHANNEL}`)
    let member = await response.json()
    return member
}
let deleteMember = async () => {
    let response = await fetch('/delete_member/', {
        method:'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body:JSON.stringify({'name':NAME, 'room_name':CHANNEL, 'UID':UID})
    })
    let member = await response.json()
}

joinAndDisplayLocalStream()

window.addEventListener('beforeunload',deleteMember)

document.getElementById('leave-btn').addEventListener('click',LeaveAndRemoveLocalStream)

document.getElementById('video-toggle').addEventListener('click',turnOffCamera)

document.getElementById('toggle-mic').addEventListener('click',turnOffMic)



