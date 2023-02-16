<!-- <template>
    <div class="xtx-steps">
      <div class="xtx-steps-item" :class="{active: i < 3}" v-for="i in 5" :key="i">
        <div class="step"><span>{{i}}</span></div>
        <div class="title">提交订单</div>
        <div class="desc">2021-03-18 02:11:47</div>
      </div>
    </div>
</template> -->
<script>

export default {
  name: 'XtxSteps',
  props: {
    active: {
      type: Number,
      default: 1
    }
  },
  render () {
    // 获取默认插槽节点
    const items = this.$slots.default()
    // 获取所有的动态生成的XtxStepsItem组件节点
    const dynamicsItems = []
    items.forEach(item => {
      // 静态
      if (item.type.name === 'XtxStepsItem') {
        dynamicsItems.push(item)
      } else {
        // 动态
        item.children.forEach(item => {
          dynamicsItems.push(item)
        })
      }
    })
    // 根据动态节点生成item的jsx对象
    const itemsJsx = dynamicsItems.map((item, i) => {
      return (
                <div class="xtx-steps-item" classname={{ active: i < this.active }}>
                    <div class="step"><span>{i + 1}</span></div>
                    <div class="title">{item.props.title}</div>
                    <div class="desc">{item.props.desc}</div>
                </div>
      )
    })
    // 插入大容器
    return <div class="xtx-steps">{itemsJsx}</div>
  }
}
</script>
<style lang="less">
.xtx-steps {
    display: flex;
    text-align: center;

    &-item {
        flex: 1;

        &:first-child {
            .step {
                &::before {
                    display: none;
                }
            }
        }

        &:last-child {
            .step {
                &::after {
                    display: none;
                }
            }
        }

        &.active {
            .step {
                >span {
                    border-color: @xtxColor;
                    background: @xtxColor;
                    color: #fff
                }

                &::before,
                &::after {
                    background: @xtxColor;
                }
            }

            .title {
                color: @xtxColor;
            }
        }

        .step {
            position: relative;

            >span {
                width: 48px;
                height: 48px;
                font-size: 28px;
                border: 2px solid #e4e4e4;
                background: #fff;
                border-radius: 50%;
                line-height: 44px;
                color: #ccc;
                display: inline-block;
                position: relative;
                z-index: 1;
            }

            &::after,
            &::before {
                content: "";
                position: absolute;
                top: 23px;
                width: 50%;
                height: 2px;
                background: #e4e4e4;
            }

            &::before {
                left: 0;
            }

            &::after {
                right: 0;
            }
        }

        .title {
            color: #999;
            padding-top: 12px;
        }

        .desc {
            font-size: 12px;
            color: #999;
            padding-top: 6px;
        }
    }
}
</style>
