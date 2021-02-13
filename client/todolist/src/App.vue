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
            :showMore="item.isOperated"
            :isChecked="item.isChecked"
            @delete-item="deleteItem(item)"
            @show-more-item="hindMore(item)"
            @hind-more-item="showMore"
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
      isOperating: false,
    };
  },
  created() {
    axios
      .get(`${URL}/todos`)
      .then(res => {
        res.data.map(item => {
          item.isOperated = false;
          this.items.unshift(item);
        });
      })
      .catch(err => {
        console.error(err);
      });
    axios
      .get(`${URL}/maxId`)
      .then(res => {
        id += res.data.maxid;
      })
      .catch(err => {
        console.error(err);
      });
  },
  methods: {
    addItem() {
      if (this.itemText != "") {
        let itemTmpData = { id: id++, text: this.itemText, isOperated: this.isOperating, isChecked: false };
        this.items.unshift(itemTmpData);
        delete itemTmpData.isOperated;
        console.log(itemTmpData);
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
          const delItemData = { id: item.id };
          console.log(delItemData);
          axios
            .delete(`${URL}/todo`, delItemData)
            .then(res => {
              console.log(res);
            })
            .catch(err => {
              console.error(err);
            });
          this.items.splice(this.items.indexOf(item), 1);
          this.showMore();
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          console.log(item.id);
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    hindMore(item) {
      this.isOperating = true;
      this.items.map(function(allitem) {
        allitem.isOperated = true;
      });
      item.isOperated = false;
    },
    showMore() {
      this.isOperating = false;
      this.items.map(function(allitem) {
        allitem.isOperated = false;
      });
    },
    checkItem(item) {
      item.isChecked = !item.isChecked;
    },
    changeItem(item, newText) {
      item.text = newText;
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
