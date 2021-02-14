<template>
  <div id="app">
    <header>
      <h1>荆棘TodoList</h1>
    </header>
    <main>
      <el-input placeholder="请输入内容" v-model="itemText" clearable>
        <el-button slot="append" @click="addItem">添加</el-button>
      </el-input>
      <ul>
        <li v-for="item in items" :key="item.id">
          <ItemCard
            :txt="item.text"
            :id="item.id"
            :isChecked="item.isChecked"
            :operatingItemId="operatingItemId"
            @delete-item="deleteItem(item)"
            @show-more-item="operatingItemId = item.id"
            @hide-more-item="operatingItemId = -1"
            @check-item="checkItem(item)"
            @edit-completed="changeItem(item, $event)"
          />
        </li>
      </ul>
    </main>
    <footer></footer>
  </div>
</template>

<script>
import ItemCard from "./components/ItemCard.vue";
import axios from "axios";

const URL = "http://localhost:3000";
let id = 1;
export default {
  name: "app",
  components: {
    ItemCard,
  },
  data() {
    return {
      itemText: "",
      items: [],
      operatingItemId: -1,
    };
  },
  created() {
    axios
      .get(`${URL}/todos`)
      .then(res => {
        res.data.map(item => {
          this.items.unshift(item);
          console.log(res);
        });
      })
      .catch(err => {
        console.error(err);
      });
    axios
      .get(`${URL}/maxId`)
      .then(res => {
        id += res.data.maxid;
        console.log(res);
      })
      .catch(err => {
        console.error(err);
      });
  },
  methods: {
    addItem() {
      if (this.itemText != "") {
        let itemTmpData = { id: id++, text: this.itemText, isChecked: false };
        this.items.unshift(itemTmpData);
        axios
          .post(`${URL}/todo`, itemTmpData)
          .then(res => {
            console.log(res);
          })
          .catch(err => {
            console.error(err);
          });
        this.itemText = "";
      }
    },
    deleteItem(item) {
      this.$confirm("此操作将删除此条Todo, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true,
      })
        .then(() => {
          axios
            .delete(`${URL}/todo`, { params: { id: item.id } })
            .then(res => {
              console.log(res);
            })
            .catch(err => {
              console.error(err);
            });
          this.items.splice(this.items.indexOf(item), 1);
          this.operatingItemId = -1;
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    checkItem(item) {
      item.isChecked = !item.isChecked;
      const checkData = { id: item.id, isChecked: item.isChecked };
      axios
        .patch(`${URL}/todoChecked`, checkData)
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.error(err);
        });
    },
    changeItem(item, newText) {
      item.text = newText;
      const checkData = { id: item.id, newText: item.text };
      axios
        .patch(`${URL}/todoText`, checkData)
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.error(err);
        });
    },
  },
};
</script>

<style lang="scss">
* {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}
#app {
  width: 80vw;
  margin: 0 auto;
  header h1 {
    text-align: center;
  }
  main {
    .el-input {
      margin-bottom: 15px;
    }
    ul {
      padding-left: 0;
      li {
        list-style: none;
      }
    }
  }
}
</style>
