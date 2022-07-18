<template>
  <div class="__select__wrap">
    <div class="__select__header">
      <input
        v-model="selected"
        @click="isSearch = isSearch ? false : true"
        type="text"
        :name="field"
        class="__select__text __select__selected"
      />
      <button
        @click.prevent="removeSelectItems"
        class="__select__btn __select__clear"
      >
        x
      </button>
    </div>
    <div v-if="isSearch" class="__select__inner">
      <div class="__select__actions">
        <a @click="selectAll" href="#" class="__select__link">Select all</a>
        <input
          v-model="searched"
          type="text"
          class="__select__text __select__search"
          placeholder="search"
        />
      </div>
      <div class="__select">
        <div @scroll="scrollUpdateData" class="__select__content">
          <div
            class="__select__option"
            v-for="(item, idx) in filteredItemList()"
            :key="item"
          >
            <input
              @input="select(item)"
              :id="`option_${this.field}-${idx}`"
              :class="`__select__input option__${this.field}`"
              type="checkbox"
              name="items[]"
              :value="item.title"
            />
            <label
              :for="`option_${this.field}-${idx}`"
              class="__select__label"
              >{{ item.title }}</label
            >
          </div>
        </div>
      </div>
      <div class="__select__footer">
        <button class="__btn __btn__apply" :name="applyName">Apply</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  mounted: async function () {
    this.url = this.$options.dataset.url;
    this.field = this.$options.dataset.field;
    this.applyName = this.$options.dataset.applyName;

    await this.loadData();

    const selectList = this.$options.dataset.selected.slice(1, -1).split(", ");
    if (selectList.length && selectList[0] != "") {
      this.selectedItemList = this.itemList.filter((item) =>
        selectList.find((select) => item.id == select)
      );
    }
  },

  data() {
    return {
      applyName: "",
      field: "",
      url: "",
      selected: "",
      searched: "",
      isSearch: false,
      itemList: [],
      selectedItemList: [],
      offset: 0,
      total: 0,
    };
  },

  methods: {
    select(newItem) {
      if (!this.selectedItemList.find((item) => item === newItem)) {
        // Ниже я сделал такую конструкцию для того, чтобы при удалении элемента из списка и повторном его добавлении
        // он появлялся на том же месте, а не в конце списка
        this.selectedItemList = this.itemList.filter(
          (item) =>
            item === newItem ||
            this.selectedItemList.find((selectItem) => selectItem === item)
        );
      } else {
        this.selectedItemList = this.selectedItemList.filter(
          (item) => item !== newItem
        );
      }
    },

    selectAll() {
      this.selectedItemList = this.itemList.map((item) => item);
      this.changeCheckbox(true);
    },

    removeSelectItems() {
      this.selectedItemList = [];
      this.changeCheckbox(false);
    },

    changeCheckbox(value) {
      const checkboxes = document.querySelectorAll(`.option__${this.field}`);
      checkboxes.forEach((elem) => (elem.checked = value));
    },

    filteredItemList() {
      const filteredList = this.itemList.filter((item) =>
        item.title.toLowerCase().includes(this.searched.toLowerCase())
      );

      this.$nextTick(() => {
        const checkboxes = document.querySelectorAll(`.option__${this.field}`);
        checkboxes.forEach((elem) => {
          if (this.selectedItemList.find((item) => item.title === elem.value))
            elem.checked = true;
        });
      });

      return filteredList;
    },

    scrollUpdateData(e) {
      if (
        e.target.scrollHeight === e.target.scrollTop + e.target.clientHeight &&
        this.offset <= this.total
      ) {
        this.loadData();
      }
    },

    async loadData() {
      const formData = new FormData();
      formData.append("limit", 50);
      formData.append("offset", this.offset);

      const res = await fetch(this.url, {
        method: "post",
        headers: { Authorization: "Bearer BT3HK2NpCnyrKiDo" },
        body: formData,
      });
      const data = await res.json();

      this.itemList = this.itemList.concat(data.message.data);
      this.offset += 50;
      this.total = data.message.total;
    },
  },

  watch: {
    selectedItemList: {
      handler() {
        const list = this.selectedItemList.map((item) => item.title);
        this.selected = list.join(" ");
      },
      deep: true,
    },
  },
};
</script>

<style scoped src="../assets/custom.css"></style>
