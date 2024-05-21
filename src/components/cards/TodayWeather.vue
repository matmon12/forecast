<template>
  <div class="summary">
    <div class="summary__header">
      <div class="summary__location">
        <i-carbon:location-filled />
        <p class="summary__location-text">New York</p>
      </div>
      <div class="summary__degree">
        <SwitchDegree
          :model-value="true"
          @toggle-switch="(value) => onChangeDegree(value)"
        />
      </div>
    </div>
    <div class="summary__content">
      <div class="summary__left">
        <div class="summary__date-wrap">
          <p class="summary-week">Tuesday</p>
          <p class="summary-date">24 Dec 2023</p>
        </div>
        <div class="summary__temp">
          <div class="summary__temp-value">26°C</div>
          <div class="summary__temp-text">
            <span>High: 27°</span><span>Low: 10°</span>
          </div>
        </div>
      </div>
      <div class="summary__right">
        <div class="summary__img-wrap">
          <img class="summary-img" width="200px" src="@/img/weather/c3.png" alt="icon" />
        </div>
        <div class="summary__right-info">
          <p class="summary__right-weather">Cloudy</p>
          <p class="summary__right-feels">Feels like 26°</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const onChangeDegree = (value) => {};
</script>

<style lang="scss" scoped>
.summary {
  @include Card();

  &__header {
    display: flex;
    justify-content: space-between;
  }

  &__location {
    background-color: $white-2;
    height: 33px;
    display: flex;
    gap: 5px;
    align-items: center;
    border-radius: 33px;
    padding: 0 20px 0 10px;
    color: $black;
  }

  &__location-text {
    font-weight: 600;
    font-size: 14px;
    line-height: 1;
  }

  &__degree {
  }

  &__content {
    display: flex;
    padding: 20px 0 10px;
    justify-content: space-between;
  }

  &__left {
    padding-top: 10px;
  }

  &__date-wrap {
    margin-bottom: 20px;
  }

  &__temp {
    
  }

  &__temp-value {
    font-size: 70px;
    font-weight: 500;
    line-height: 1.2;
  }

  &__temp-text {
    color: #ffffffc9;
  }

  &__right {
    text-align: right;
  }

  &__img-wrap {
    height: 190px; 
  }

  &__right-info {
  }

  &__right-weather {
    font-size: 32px;
    line-height: 1.3;
  }

  &__right-feels {
    color: #ffffffc9;
  }
}
.summary-week {
  font-weight: 700;
  font-size: 34px;
}
.summary-date {
  line-height: 1.3;
  color: #ffffffc9;
}
.summary-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
