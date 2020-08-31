import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        music: {
            id: 0,
            name: "",
            singer: "",
            longs: "",
            link: "",
            image: "",
        },
        fileUrl: "http://forestj.oss-cn-beijing.aliyuncs.com",
        playList: [],
        currentIndex: -1
    },
    mutations: {
        changeMusic(state, newMusic) {
            let i = 0;
            for (i = 0; i < state.playList.length; i++) {
                if (state.playList[i].id == newMusic.id) {
                    break;
                }
            }
            if (i < state.playList.length) {
                state.currentIndex = i;
                state.music = state.playList[state.currentIndex];
            } else {
                state.currentIndex = state.playList.push(newMusic) - 1;
                state.music = state.playList[state.currentIndex];
            }
            // state.music = newMusic;
        },

        nextMusic(state) {
            if (state.playList.length <= 0) return;
            state.currentIndex = (state.currentIndex + 1) % state.playList.length;
            state.music = state.playList[state.currentIndex];

        },

        preMusic(state) {
            if (state.playList.length <= 0) return;
            if (state.currentIndex == 0) {
                state.currentIndex = state.playList.length - 1;
            } else {
                state.currentIndex--;
            }
            state.music = state.playList[state.currentIndex];
        },

        addMusic(state, newMusic) {
            let i = 0;
            for (i = 0; i < state.playList.length; i++) {
                if (state.playList[i].id == newMusic.id) {
                    break;
                }
            }
            if (i >= state.playList.length) {
                state.playList.push(newMusic)
            }
            if (state.playList.length === 1) {
                state.currentIndex = 0;
                state.music = state.playList[state.currentIndex];
            }
        },

        clearList(state) {
            state.music = {}
            state.playList = [];
            state.currentIndex = -1;
        },

        changeList(state, list) {
            if (list.length <= 0) return;
            state.currentIndex = 0;
            state.playList = list;
            state.music = state.playList[state.currentIndex];
        },

        tryPlay1(state) {
            if (state.playList.length <= 0) return;
            if (state.currentIndex < 0) state.currentIndex = 0;
            state.music = {};
        },

        tryPlay2(state){
            if (state.playList.length <= 0) return;
            state.music = state.playList[state.currentIndex];
        }
    }
})

export default store