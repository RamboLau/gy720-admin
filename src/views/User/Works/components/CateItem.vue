<template>
  <div
    class="clearfix"
    :class="itemClass"
    @click.stop="onChooseCate"
  >
    <i class="iconfont works-cateitem__tag--choose">
      &#xe60c;
    </i>
    <!-- id为1是默认分类，不提供（不允许）删除 -->
    <i class="iconfont works-cateitem__tag--delete"
      v-if="item.id && item.id !== 1"
      @click.stop="onDeleteCate"
    >
      &#xe615;
    </i>
    <el-row class="btn-text">
      <el-col :span="18" class="ellipsis">
        {{item.name}}
      </el-col>
      <el-col :span="6" class="ellipsis" :title="item.count">
        ({{item.count}})
      </el-col>
    </el-row>
  </div>
</template>

<script>
/**
 * 我的作品 - 作品单分类
 *
 * @author huojinzhao
 */

export default {
  name: 'works-cate-item',

  props: {
    item: {
      type: Object,
      required: true,
    },

    active: {
      type: Boolean,
      required: true,
    },
  },

  computed: {
    itemClass() {
      return [
        'works-cateitem',
        {
          'works-cateitem--active': this.active,
        },
      ]
    },
  },

  methods: {
    onChooseCate() {
      this.$emit('chooseCate', this.item.id)
    },

    onDeleteCate() {
      this.$emit('deleteCate', this.item.id)
    },
  },
}
</script>

<style>
@import 'vars.css';

.works-cateitem {
  position: relative;
  overflow: hidden;

  &:hover {
    & .works-cateitem__tag--delete {
      display: block;
    }
  }

  &--active:hover {
    & .works-cateitem__tag--delete {
      display: none;
    }
  }

  &--active {
    & .works-cateitem__tag--choose {
      display: block;
    }
  }

  &__tag--choose {
    position: absolute;
    left: 0;
    display: none;
    color: var(--color-primary);
  }

  &__tag--delete {
    position: absolute;
    left: 0;
    display: none;
    z-index: 1;
    color: var(--color-warning);
  }
  > .el-row {
    margin-right: -12px;

    .el-col {
      + .el-col {
        padding-left: 2px;
        text-align: left;
      }
    }
  }
}
</style>

