<template>
  <w-form-container>
    <el-form label-width="124px" label-suffix="：">
      <el-form-item label="昵称">
        <el-input placeholder="请输入昵称" clearable />
      </el-form-item>
      <el-form-item label="手机号码">
        <el-input placeholder="请输入手机号码" clearable />
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input placeholder="请输入邮箱" clearable />
      </el-form-item>
      <el-form-item label="地址">
        <el-input placeholder="请输入地址" clearable />
      </el-form-item>
      <el-form-item label="备注" class="col-span-2" v-for="i in 3" :key="i">
        <el-input type="textarea" placeholder="请输入备注" clearable />
      </el-form-item>
    </el-form>
  </w-form-container>
</template>
