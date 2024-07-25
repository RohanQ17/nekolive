const APP_ID = '6cc682162c644073bf5e4aede97b7ffd '

const CHANNEL ='main'
const TOKEN ='007eJxTYNibbKeccuV8/JZHsf9SZjkHyk4TKdmzZ53c6TUTOoNv3duvwGCWnGxmYWRoZpRsZmJiYG6clGaaapKYmpJqaZ5knpaWclNhUVpDICPDnPi9TIwMEAjiszDkJmbmMTAAANf7Ib4='
let UID
const client = AgoraRTC.createClient({mode:'rtc',codec:'vp8'})

let localTracks  =[]
let remoteUsers ={}

let joinAndDisplayLocalStream = async()=> {
    UID = await client.join(APP_ID, CHANNEL, TOKEN, null)
    localTracks = await AgoraRTC.createMicrophoneAndCameraTracks()

    let player = `<div class="video-container" id="user-container-${UID}">
            <div class="username-wrapper"><span class="user-name">myname</span></div>
            <div class="video-player" id="user-${UID}"></div>
        </div>`

    document.getElementById('video-streams').insertAdjacentHTML('beforeend',player)
    localTracks[1].play(`user-${UID}`)

    await client.publish([localTracks[0],localTracks[1]])
}

joinAndDisplayLocalStream()
