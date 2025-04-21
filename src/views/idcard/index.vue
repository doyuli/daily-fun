<script setup lang="ts">
import { getBankno, getIdno, getMobile, getName } from './components/generate';
import { ref } from 'vue';
import ExcelJS from 'exceljs';

function generate(limit = 10000) {

  const nameSet = new Set()

  const idnoSet = new Set<{
    idno: string;
    birthday: string;
    age: number;
    sex: number;
    address: string
  }>()

  const bankSet = new Set()

  while (nameSet.size < limit) {
    nameSet.add(getName())
  }

  while (idnoSet.size < limit) {
    idnoSet.add(getIdno())
  }

  while (bankSet.size < limit) {
    bankSet.add(getBankno())
  }

  // 使用 Set 的 values() 获取唯一值，并转为数组进行访问
  const nameArray = Array.from(nameSet.values())
  const idnoArray = Array.from(idnoSet.values())
  const bankArray = Array.from(bankSet.values())


  const list = Array.from({ length: limit }, (_, i) => {
    const { idno, birthday, age, address, sex } = idnoArray[i]
    return {
      name: nameArray[i],
      idno: idno,
      bank: bankArray[i],
      birthday,
      age,
      address,
      sex: sex == 1 ? '男' : '女',
      mobile: getMobile()
    }
  })

  return list
}

const limit = ref(10000)

function generatExcel() {
  const list = generate(limit.value)

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('用户信息');

  // 设置列定义（可选，用于设置列宽和格式）
  worksheet.columns = [
    { header: '姓名', key: 'name', width: 15 },
    { header: '身份证号', key: 'idno', width: 20, },
    { header: '银行卡号', key: 'bank', width: 20, }
  ];

  // 添加表头
  worksheet.getRow(1).font = { bold: true }; // 设置表头加粗

  // 添加数据行
  list.forEach(user => {
    worksheet.addRow(user);
  });

  // 保存文件
  workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = '用户信息表.xlsx';
    link.click();
  }).catch(err => {
    console.error('生成Excel文件时出错:', err);
  });
}
</script>

<template>
  <div class="idcard-container">
    <h2>用户信息生成器</h2>
    <el-input-number v-model="limit"></el-input-number>
    <el-button type="primary" @click="generatExcel">生 成</el-button>
  </div>
</template>

<style lang="scss" scoped>
.idcard-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  min-height: 100vh;
  gap: 20px;
}
</style>