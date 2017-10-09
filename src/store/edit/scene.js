import Http from '@/utils/http'
import { EDIT } from '../mutationTypes'

const { SCENE } = EDIT

export default {
  state: {
    list: [],
    public: {
      // scene_effect
      effect: false,
      /*
        'pc_commentate',
        'mobile_commentate',
        'bg_music',
        'commentate_sound',
      */
      narrate: false,
      // 'top_ad_img'
      sky: false,
      // 'bottom_ad_img'
      ground: false,
    },
  },

  actions: {
    /**
     * 获取场景信息
     * 返回当前选中场景（加载完默认为第一项）的id，以便调用热点接口时能确保拿到此id
     */
    [SCENE.INIT]({ dispatch, commit, getters }, param = { active: 0, pano_id: '' }) {
      const panoId = param.pano_id || getters.panoId
      return Http.get(`/user/scene?pano_id=${panoId}`)
        .then(({ result }) => {
          // eslint-disable-next-line
          const krpano = window.__krpano

          // 当前场景id
          const sceneId = result[param.active].id

          // 设置场景列表
          commit(SCENE.INIT, { active: param.active, scenes: result })

          // 加载当前场景热点
          krpano.hotspots = {}
          dispatch(EDIT.HOTSPOTS.INIT.SPOTS, { scene_id: sceneId, pano_id: panoId })

          // 跳转指定场景
          krpano.call(`ac_gotoscene(${sceneId})`)

          return sceneId
        })
    },
  },

  mutations: {
    /**
     * 获取场景数据
     * 默认把第一个场景设为当前场景
     */
    [SCENE.INIT](state, { active, scenes }) {
      state.list = scenes.map((item, index) => ({
        ...item,
        active: active === index,
      }))
    },

    /**
     * 更新某一个场景的信息
     * 若更新的属性是active，则必须把其它场景的active重置为false
     * @param {Object} state
     * @param {{ id: number, update: Object }} data
     */
    [SCENE.UPDATE](state, { id, update }) {
      state.list = state.list.map((scene) => {
        if (scene.id === id) {
          return { ...scene, ...update }
        }
        if (update.active) {
          return { ...scene, active: false }
        }
        return scene
      })
    },

    [SCENE.DELETE](state, id) {
      state.list = state.list
        .filter(scene => scene.id !== id)

      // 删除XML场景
      // eslint-disable-next-line
      window.__krpano.get('scene').removeItem(`scene_pano_${id}`)
    },
  },

  getters: {
    /**
     * 当前场景
     */
    activeScene(state) {
      return state.list.find(scene => scene.active)
    },

    applyToAll(state) {
      const list = state.list

      const isApplyToAll = (...props) =>
        list.every(
          item => props.every(key => item[key] && item[key] === list[0][key]),
        )

      return {
        effect: isApplyToAll('scene_effect'),
        narrate: isApplyToAll(
          'bg_music',
          'pc_commentate',
          'mobile_commentate',
          'commentate_sound',
        ),
        sky: isApplyToAll('top_ad_img'),
        ground: isApplyToAll('bottom_ad_img'),
      }
    },
  },
}
