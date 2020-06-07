<template>
  <div id="tags-view-container" class="tags-view-container">
    <el-tabs
      v-model="selectedTagName"
      class="tags-view-wrapper"
      @tab-click="clickTab"
      @tab-remove="closeTag"
    >
      <el-tab-pane
        v-for="tag in visitedViews"
        :key="tag.name"
        :label="tag.title"
        :closable="!isAffix(tag)"
        :name="tag.name"
      />
    </el-tabs>
    <el-dropdown class="more-action">
      <span style="cursor: pointer;">
        更多操作
        <i class="el-icon-arrow-down el-icon--right" />
      </span>
      <el-dropdown-menu slot="dropdown" class="tags-more">
        <el-dropdown-item @click.native="refreshRoute">
          <i class="mr5 el-icon-refresh" />刷新
        </el-dropdown-item>
        <el-dropdown-item @click.native="closeOthersTags">
          <i class="mr5 el-icon-circle-close" />关闭其他
        </el-dropdown-item>
        <el-dropdown-item @click.native="closeAllTags">
          <i class="el-icon-error mr5" />关闭全部
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import path from 'path'

export default {
  data() {
    return {
      selectedTagName: null,
      affixTags: []
    }
  },
  computed: {
    visitedViews() {
      return this.$store.state.tagsView.visitedViews
    },
    routes() {
      return this.$store.state.permission.routes
    }
  },
  watch: {
    $route() {
      this.addTags()
      this.selectedTagName = this.$route.name
    }
  },
  mounted() {
    this.initTags()
    this.addTags()
    this.selectedTagName = this.$route.name
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
      routes.forEach(route => {
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
      const affixTags = this.affixTags = this.filterAffixTags(this.routes)
      for (const tag of affixTags) {
        // Must have tag name
        if (tag.name) {
          this.$store.dispatch('tagsView/addVisitedView', tag)
        }
      }
    },
    addTags() {
      const { name } = this.$route
      if (name) {
        this.$store.dispatch('tagsView/addView', this.$route)
      }
    },
    refreshRoute() {
      const view = this.$route
      this.$store.dispatch('tagsView/delCachedView', view).then(() => {
        const { fullPath } = view
        this.$nextTick(() => {
          this.$router.replace({
            path: '/redirect' + fullPath
          })
        })
      })
    },
    findRouteByName(name) {
      const routerList = this.visitedViews.filter(item => item.name === name)
      if (routerList && routerList.length > 0) {
        return routerList[0]
      }
      return null
    },
    closeTag(name) {
      const view = this.findRouteByName(name)
      this.$store.dispatch('tagsView/delView', view).then(({ visitedViews }) => {
        if (this.isActive(view)) {
          this.toLastView(visitedViews, view)
        }
      })
    },
    closeOthersTags() {
      const view = this.findRouteByName(this.selectedTagName)
      this.$store.dispatch('tagsView/delOthersViews', view)
    },
    closeAllTags() {
      const view = this.findRouteByName(this.selectedTagName)
      this.$store.dispatch('tagsView/delAllViews').then(({ visitedViews }) => {
        if (this.affixTags.some(tag => tag.path === view.path)) {
          return
        }
        this.toLastView(visitedViews, view)
      })
    },
    toLastView(visitedViews, view) {
      const latestView = visitedViews.slice(-1)[0]
      if (latestView) {
        this.$router.push(latestView.fullPath)
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
    },
    clickTab(tab) {
      if (tab.name === this.$route.name) {
        return
      }
      const tag = this.findRouteByName(tab.name)
      this.$router.push(tag.fullPath)
    }
  }
}
</script>

<style lang="scss" scoped>
.tags-view-container {
  width: 100%;
  background: #fff;
  position: relative;
  box-shadow: 0 0.46875rem 2.1875rem rgba(49, 103, 222, 0.03),
    0 0.9375rem 1.40625rem rgba(4, 9, 20, 0.03),
    0 0.25rem 0.53125rem rgba(4, 9, 20, 0.05),
    0 0.125rem 0.1875rem rgba(4, 9, 20, 0.03);
  box-sizing: border-box;
  overflow: hidden;

  /deep/ .el-tabs__active-bar {
    display: none;
  }

  /deep/ .el-tabs__header {
    margin: 0px;
  }
  .tags-view-wrapper {
    width: calc(100% - 85px);
    float: left;
    padding: 0 5px;

    /deep/ .el-tabs__item {
      color: #666;
      &:focus:active,
      &:focus {
        outline: none;
      }
      &:last-child {
        padding-right: 20px;
      }
      &:nth-child(2) {
        padding-left: 20px;
      }
      &.is-active {
        color: rgba(0, 0, 0, 0.85);
        background-color: #f6f6f6;
        &:after {
          left: 0;
          background-color: #292b34;
          width: 100%;
        }
      }
      &::after {
        content: "";
        display: inline-block;
        position: absolute;
        bottom: 0;
        left: 50%;
        width: 0;
        height: 1px;
        -webkit-transition: all 0.3s ease;
        transition: all 0.3s ease;
      }
      &:hover::after {
        left: 0;
        background-color: #292b34;
        width: 100%;
      }
    }

    /deep/ .el-tabs__nav-wrap::after {
      height: 0;
      background-color: #fff;
    }
  }
  .more-action {
    width: 85px;
    float: right;
    line-height: 40px;
  }
  .mr5 {
    padding-right: 5px;
  }

  /deep/ .el-tabs__nav-next,
  /deep/ .el-tabs__nav-prev {
    position: absolute;
    cursor: pointer;
    line-height: 40px;
    font-size: 14px;
    color: #909399;
  }
}
</style>
