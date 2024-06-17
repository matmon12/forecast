<template>
  <div
    ref="panel"
    :class="['panel', { 'is--open': isOpen }]"
    :style="{ height: isOpen ? `${panel.scrollHeight}px` : undefined }"
  >
    <div @click="isOpen = !isOpen" class="panel__top">
      <Avatar class="panel-avatar" :image="getImageUrl('avatar.svg')" shape="circle" />
      <p class="panel-name">Teddy Harper</p>
      <div class="panel-arrow">
        <i-iconamoon:arrow-down-2 />
      </div>
    </div>
    <div class="panel__content">
      <ul class="panel__list" >
        <li class="panel__list-item" v-for="item in menu" :key="item">
          <p class="panel__list-icon">
            <component :is="item.icon" />
          </p>
          <p class="panel__list-text">{{ item.label }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, shallowRef } from "vue";
import IcRoundControlPoint from "~icons/ic/round-control-point";
import BitcoinIconsExitFilled from '~icons/bitcoin-icons/exit-filled';
import { getImageUrl } from "../utils/index";

const panel = ref();
const isOpen = ref(false);

const menu = shallowRef([
  {
    label: "Menu",
    icon: IcRoundControlPoint,
  },
  {
    label: "Menu",
    icon: IcRoundControlPoint,
  },
  {
    label: "Menu",
    icon: IcRoundControlPoint,
  },
  {
    label: "Exit",
    icon: BitcoinIconsExitFilled,
  },
]);
</script>

<style lang="scss" scoped>
.panel {
  background-color: $grey;
  border-radius: 20px;
  height: 50px;
  transition: height 0.3s;
  overflow: hidden;
  position: absolute;
  right: 0;
  z-index: 100;
  box-shadow: 0 0 10px #000;

  &__top {
    padding: 10px 25px 10px 10px;
    display: flex;
    align-items: center;
    height: 50px;
    cursor: pointer;
  }

  &__content {
    padding: 10px;
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  &__list-item {
    display: flex;
    gap: 5px;
    padding: 7px 5px;
    border-radius: 10px;
    transition: background-color .3s;
    cursor: pointer;
    &:hover{
      background-color: #ffffff41;
    }
    &:last-child {
      margin-top: 15px;
      position: relative;
      &::before {
        content: "";
        position: absolute;
        background-color: $grey-light;
        height: 1px;
        width: calc(100% - 10px);
        top: -10px;
        left: 50%;
        transform: translateX(-50%);
      }
    }
  }

  &__list-icon {
    display: flex;
    svg {
      font-size: 16px;
    }
  }

  &__list-text {
    font-size: 14px;
  }
}
.panel-avatar {
  height: 35px;
  width: 35px;
  img {
    height: 100%;
    width: 100%;
  }
}
.panel-name {
  padding: 0 20px 0 5px;
  font-size: 14px;
}
.panel-arrow {
  display: flex;
  align-items: center;
  svg {
    transition: all 0.3s;
  }
}

.is--open {
  .panel-arrow {
    svg {
      transform: rotate(180deg);
    }
  }
}
</style>
