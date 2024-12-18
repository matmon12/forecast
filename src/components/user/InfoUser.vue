<template>
  <div class="user">
    <div class="user__left">
      <Avatar
        v-if="!authStore.user?.image"
        :image="getImageUrl('profile-avatar.svg')"
        class="user-avatar"
      >
        <template #icon>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
          >
            <g fill="currentColor">
              <path d="M11 6a3 3 0 1 1-6 0a3 3 0 0 1 6 0" />
              <path
                fill-rule="evenodd"
                d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
              />
            </g>
          </svg>
        </template>
      </Avatar>
      <Image
        v-else
        :name="authStore.user?.image"
        :id="authStore.uid"
        preview
        path="images/users/"
        class="user-avatar"
      />
    </div>
    <div class="user__right">
      <p class="user-name">
        {{
          authStore.user?.name
            ? `${authStore.user?.name} ${authStore.user?.lastname}`
            : getUsername(authStore.user?.email)
        }}
      </p>
      <Divider class="user-divider" />
      <ul class="user__list">
        <li class="user__list-item">
          <p class="user__list-left">Email:</p>
          <p class="user__list-right">{{ authStore.user?.email }}</p>
        </li>
        <li class="user__list-item">
          <p class="user__list-left">Phone:</p>
          <p class="user__list-right">
            {{ authStore.user?.phone?.number || "Not specified" }}
          </p>
        </li>
        <li class="user__list-item">
          <p class="user__list-left">Country:</p>
          <p class="user__list-right user__list-country">
            <span>
              {{ authStore.user?.country?.name || "Not specified" }}
            </span>
            <country-flag
              v-if="authStore.user?.country"
              :country="authStore.user?.country.flag"
              rounded
              class="country-flag"
            />
          </p>
        </li>
        <li class="user__list-item">
          <p class="user__list-left">Registration:</p>
          <p class="user__list-right">
            {{ timeRegistration(authStore.user?.createdAt) }} ago
          </p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth";
import { getImageUrl, pluralize, getUsername } from "@/utils/index";
import CountryFlag from "vue-country-flag-next";

const authStore = useAuthStore();

const timeRegistration = (date) => {
  const milliseconds = Date.now() - new Date(date);
  let unitOfTime = milliseconds / 1000;

  if (unitOfTime < 60) {
    const flooredTime = Math.floor(unitOfTime);
    return `${flooredTime} second${pluralize(flooredTime)}`;
  }

  unitOfTime /= 60;
  if (unitOfTime < 60) {
    const flooredTime = Math.floor(unitOfTime);
    return `${flooredTime} minute${pluralize(flooredTime)}`;
  }

  unitOfTime /= 60;
  if (unitOfTime < 24) {
    const flooredTime = Math.floor(unitOfTime);
    return `${flooredTime} hour${pluralize(flooredTime)}`;
  }

  unitOfTime /= 24;
  if (unitOfTime < 30) {
    const flooredTime = Math.floor(unitOfTime);
    return `${flooredTime} day${pluralize(flooredTime)}`;
  }

  unitOfTime /= 30.44;
  if (unitOfTime < 12) {
    const flooredTime = Math.floor(unitOfTime);
    return `${flooredTime} month${pluralize(flooredTime)}`;
  }

  unitOfTime /= 12;
  const flooredTime = Math.floor(unitOfTime);
  return `${flooredTime} year${pluralize(flooredTime)}`;
};
</script>

<style lang="scss" scoped>
@include InfoUser();
.user {
  @include Card();
  height: min-content;
  text-align: center;
  padding-top: 35px;
  padding-bottom: 20px;
}
.user-title {
}
.user-avatar {
  width: 200px;
  height: 200px;
  font-size: 40px;
  border-radius: 50%;
  margin: 0 auto;
  svg{
    width: 100%;
    height: 100%;
    color: var(--white-3);
  }
}
:deep() {
  .picture-image-img {
    height: 100%;
    object-fit: cover;
  }
}
.user-name {
  font-size: 26px;
  font-weight: 500;
}

.user__list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.user__list-item {
  display: flex;
  align-items: center;
}
.user__list-left {
  background-color: var(--grey);
  padding-right: 10px;
  min-width: 120px;
  text-align: left;
}
.user__list-right {
  background-color: var(--grey);
  padding-left: 10px;
  font-size: 14px;
  color: var(--blue-330);
  @include TextOverflow(1);
  display: block;
  white-space: nowrap;
}
.user__list-country {
  display: grid;
  grid-template-columns: 1fr 30px;
  gap: 5px;
  align-items: center;
  span {
    @include TextOverflow(1);
    display: block;
  }
}
.country-flag.normal-flag {
  margin: -0.6em -0.9em -0.6em -0.7em;
  border: 1px solid #000;
}
.user-divider {
  margin: 20px 0;
}
</style>
