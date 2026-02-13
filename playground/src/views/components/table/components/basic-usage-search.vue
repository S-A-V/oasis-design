<template>
  <w-search-container-jm :columns="4" control-width="240px">
    <el-form label-width="124px" label-suffix="：">
      <el-form-item label="姓名">
        <el-input placeholder="请输入姓名" clearable />
      </el-form-item>
      <el-form-item label="昵称">
        <el-input placeholder="请输入昵称" clearable />
      </el-form-item>
      <el-form-item label="年龄">
        <el-input placeholder="请输入年龄" clearable />
      </el-form-item>
      <el-form-item label="性别">
        <el-select placeholder="请选择性别" clearable>
          <el-option label="男" value="male" />
          <el-option label="女" value="female" />
        </el-select>
      </el-form-item>
      <el-form-item label="地址" class="col-span-2">
        <el-input placeholder="请输入地址" clearable class="!w-full" />
      </el-form-item>
    </el-form>

    <template #advanced>
      <el-form label-width="124px" label-suffix="：">
        <el-form-item label="爱好">
          <el-select placeholder="请选择爱好" clearable>
            <el-option label="阅读" value="reading" />
            <el-option label="旅行" value="traveling" />
            <el-option label="运动" value="sports" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select placeholder="请选择状态" clearable>
            <el-option label="活跃" value="active" />
            <el-option label="离线" value="offline" />
          </el-select>
        </el-form-item>
      </el-form>
    </template>

    <template #footer>
      <el-button type="primary">
        <template #icon>
          <i-ep-search />
        </template>
        查询
      </el-button>
      <el-button>
        <template #icon>
          <i-ep-refresh />
        </template>
        重置
      </el-button>
    </template>
  </w-search-container-jm>
</template>
