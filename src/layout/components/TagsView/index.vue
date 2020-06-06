<template>
  <div id="tags-bar-container" class="tags-bar-container">
    <el-tabs v-model="currentTab" type="card" @tab-remove="closeSelectedTag" @tab-click="toPage">
      <el-tab-pane
        v-for="item in visitedRoutes"
        :key="item.path"
        ref="tag"
        :label="item.title"
        :name="item.name"
        :closable="!isAffix(item)"
      />
    </el-tabs>
    <el-dropdown>
      <span style="cursor: pointer;">
        更多操作
        <i class="el-icon-arrow-down el-icon--right" />
      </span>
      <el-dropdown-menu slot="dropdown" class="tags-more">
        <el-dropdown-item @click.native="refreshRoute">
          <svg-icon
            icon-class="circle-notch"
            style="margin-right: 5px;"
          />
          刷新
        </el-dropdown-item>
        <el-dropdown-item @click.native="closeOthersTags">
          <svg-icon
            icon-class="times-circle"
            style="margin-right: 5px;"
          />
          关闭其他
        </el-dropdown-item>
        <el-dropdown-item @click.native="closeLeftTags">
          <svg-icon
            icon-class="times-circle"
            style="margin-right: 5px;"
          />
          关闭左侧
        </el-dropdown-item>
        <el-dropdown-item @click.native="closeRightTags">
          <svg-icon
            icon-class="times-circle"
            style="margin-right: 5px;"
          />
          关闭右侧
        </el-dropdown-item>
        <el-dropdown-item @click.native="closeAllTags">
          <svg-icon
            icon-class="times-circle"
            style="margin-right: 5px;"
          />
          关闭全部
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import path from 'path'
import { mapGetters } from 'vuex'

export default {
  name: 'TagsView',
  data() {
    return {
      currentTab: null,
      affixTags: []
    }
  },

  computed: {
    ...mapGetters({
      visitedRoutes: 'visitedRoutes',
      routes: 'routers'
    })
  },
  watch: {
    $route(route) {
      // if you go to the redirect page, do not update the breadcrumbs
      if (route.path.startsWith('/redirect/')) {
        console.log(route)

        return
      }
      this.addTags()
    }
  },
  mounted() {
    this.initTags()
    this.addTags()
  },
  methods: {
    isActive(route) {
      return route.path === this.$route.path
    },
    isAffix(tag) {
      return tag.meta && tag.meta.affix
    },
    filterAffixTags(routes, basePath = '/') {
      let tags = []
      routes.forEach((route) => {
        if (route.meta && route.meta.affix) {
          const tagPath = path.resolve(basePath, route.path)
          tags.push({
            fullPath: tagPath,
            path: tagPath,
            name: route.name,
            meta: { ...route.meta }
          })
        }
        if (route.children) {
          const tempTags = this.filterAffixTags(route.children, route.path)
          if (tempTags.length >= 1) {
            tags = [...tags, ...tempTags]
          }
        }
      })
      return tags
    },
    initTags() {
      const affixTags = (this.affixTags = this.filterAffixTags(this.routes))
      for (const tag of affixTags) {
        if (tag.name) {
          this.$store.dispatch('tagsView/addVisitedRoute', tag)
        }
      }
    },
    addTags() {
      const { name } = this.$route
      this.currentTab = name
      if (name) {
        this.$store.dispatch('tagsView/addRoute', this.$route)
      }
      return false
    },
    toPage(tab) {
      const name = tab.name
      const arr = this.visitedRoutes.filter(item => {
        if (name === item.name) {
          return item
        }
      })
      const router = arr[0]
      this.$router.push(router)
    },
    refreshRoute() {
      const arr = this.visitedRoutes.filter((item, index) => {
        if (item.path === this.$route.fullPath) {
          return item
        }
      })
      const view = arr[0]
      this.$store.dispatch('tagsView/delCachedRoutes', view).then(() => {
        const { fullPath } = view
        this.$nextTick(() => {
          this.$router.replace({
            path: '/redirect' + fullPath
          })
        })
      })
    },
    closeSelectedTag(name) {
      const arr = this.visitedRoutes.filter((item, index) => {
        if (item.name === name) {
          return item
        }
      })
      const view = arr[0]
      this.$store
        .dispatch('tagsView/delRoute', view)
        .then(({ visitedRoutes }) => {
          if (this.isActive(view)) {
            this.toLastView(visitedRoutes, view)
          }
        })
    },
    closeOthersTags() {
      const { name } = this.$route
      const arr = this.visitedRoutes.filter((item, index) => {
        if (item.name === name) {
          return item
        }
      })
      const view = arr[0]
      this.$router.push(view)
      this.$store.dispatch('tagsView/delOthersRoutes', view)
    },
    closeLeftTags() {
      const { name } = this.$route
      const arr = this.visitedRoutes.filter((item, index) => {
        if (item.name === name) {
          return item
        }
      })
      const view = arr[0]
      this.$router.push(view)
      this.$store.dispatch('tagsView/delLeftRoutes', view)
    },
    closeRightTags() {
      const { name } = this.$route
      const arr = this.visitedRoutes.filter((item, index) => {
        if (item.path === name) {
          return item
        }
      })
      const view = arr[0]
      this.$router.push(view)
      this.$store.dispatch('tagsView/delRightRoutes', view)
    },
    closeAllTags() {
      this.$store.dispatch('tagsView/delAllRoutes').then(({ visitedRoutes }) => {
        this.$router.push('/')
      })
    },
    toLastView(visitedRoutes, view) {
      const latestView = visitedRoutes.slice(-1)[0]
      if (latestView) {
        this.$router.push(latestView)
      } else {
        // now the default is to redirect to the home page if there is no tags-view,
        // you can adjust it according to your needs.
        if (view.name === 'Dashboard') {
          // to reload home page
          this.$router.replace({ path: '/redirect' + view.fullPath })
        } else {
          this.$router.push('/')
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.tags-bar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  user-select: none;
  background: #ffffff;

  .tags-icon {
    float: left;
    width: 30px;
    margin-top: 16px;
    font-size: 12px;
    color: gray;

    text-align: center;
    vertical-align: auto;
    cursor: pointer;

    &:hover {
      opacity: 0.9;
    }
  }

  .tags-content {
    float: left;
    width: calc(100% - 145px);

    .tags-bar-item {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-items: center;
      height: 26px;
      padding: 0 15px 0 15px;
      margin-top: 6px;
      margin-right: 5px;
      font-size: 12px;
      line-height: 26px;
      cursor: pointer;
      background: #fff;
      border: 1px solid #d8dce5;
      border-radius: 2px;

      &.active {
        color: #ffffff;
        background-color: blue;
        border: 1px solid blue;
      }

      .el-icon-close {
        position: relative;
        box-sizing: border-box;
        display: inline-flex;
        align-items: center;
        justify-items: center;
        width: 15px;
        height: 15px;
        margin: 0 0 0 3px;

        &::before {
          position: absolute;
          top: 2px;
          left: 1.5px;
        }

        &:hover {
          color: #fff;
          background-color: red;
          border-radius: 50%;
        }
      }
    }
  }

}
/deep/ .el-tabs__header {
  margin: 0;
}
</style>
