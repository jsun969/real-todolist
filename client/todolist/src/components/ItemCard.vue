<template>
  <div class="card">
    <el-card class="box-card" shadow="hover">
      <div id="item-text">
        <span :class="{ ckecked_item: isChecked }">{{ txt }}</span>
      </div>
      <div id="tools" v-if="operatingItemId === id || operatingItemId === -1">
        <div id="edit-input" v-if="doEditText">
          <el-input v-model="editInput">
            <el-button slot="append" icon="el-icon-check" @click="editCompleted"></el-button>
            <el-button slot="append" icon="el-icon-close" @click="editCancel"></el-button>
          </el-input>
        </div>
        <div id="operate" v-if="!doEditText">
          <el-button icon="el-icon-more" circle @click="showOperation" v-if="!doShowMoreOperations" style="margin-left:auto"></el-button>
          <el-button type="danger" icon="el-icon-delete" circle v-if="doShowMoreOperations" @click="$emit('delete-item')"></el-button>
          <el-button type="primary" icon="el-icon-edit" circle v-if="doShowMoreOperations" @click="doEditText = true"></el-button>
          <el-button type="warning" icon="el-icon-s-check" circle v-if="doShowMoreOperations" @click="$emit('check-item')"></el-button>
          <el-button type="info" icon="el-icon-close" circle v-if="doShowMoreOperations" @click="hideOperation"></el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "ItemCard",
  props: {
    txt: String,
    id: Number,
    isChecked: Boolean,
    operatingItemId: Number,
  },
  data() {
    return {
      doShowMoreOperations: false,
      doEditText: false,
      editInput: this.txt,
    };
  },
  methods: {
    showOperation() {
      this.doShowMoreOperations = true;
      this.$emit("show-more-item");
    },
    hideOperation() {
      this.doShowMoreOperations = false;
      this.$emit("hide-more-item");
    },
    editCompleted() {
      this.doEditText = false;
      this.$emit("edit-completed", this.editInput);
    },
    editCancel() {
      this.doEditText = false;
      this.editInput = this.txt;
    },
  },
};
</script>

<style lang="scss">
.card {
  margin-bottom: 10px;
  .el-card__body {
    height: 80.5px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    .ckecked_item {
      text-decoration: line-through;
    }
    #item-text {
      display: flex;
      align-items: baseline;
    }
    #operate {
      display: flex;
    }
    #edit-input {
      width: 200px;
    }
  }
}
</style>
