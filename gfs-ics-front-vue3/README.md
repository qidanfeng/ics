<div align="center">
	<img src="./public/favicon.svg" width="160" />
	<h1>SoybeanAdmin</h1>
  <span>中文 | <a href="./README.en_US.md">English</a></span>
</div>

## 版本

- **NaiveUI 版本:**
  - [预览地址](https://naive.soybeanjs.cn/)
  - [Github 仓库](https://github.com/soybeanjs/soybean-admin)
  - [Gitee 仓库](https://gitee.com/honghuangdc/soybean-admin)
  - [Gitcode 仓库](https://gitcode.com/soybeanjs/soybean-admin)
- **AntDesignVue 版本:**
  - [预览地址](https://antd.soybeanjs.cn/)
  - [Github 仓库](https://github.com/soybeanjs/soybean-admin-antd)
  - [Gitee 仓库](https://gitee.com/honghuangdc/soybean-admin-antd)
  - [Gitcode 仓库](https://gitcode.com/soybeanjs/soybean-admin-antd)
- **ElementPlus 版本:**
  - [预览地址](https://elp.soybeanjs.cn/)
  - [Github 仓库](https://github.com/soybeanjs/soybean-admin-element-plus)
  - [Gitee 仓库](https://gitee.com/honghuangdc/soybean-admin-element-plus)
  - [Gitcode 仓库](https://gitcode.com/soybeanjs/soybean-admin-element-plus)
- **旧版:**
  - [预览地址](https://legacy.soybeanjs.cn/)
  - [Github 仓库](https://github.com/soybeanjs/soybean-admin/tree/legacy)
  - [Gitee 仓库](https://gitee.com/honghuangdc/soybean-admin/tree/legacy)
  - [Gitcode 仓库](https://gitcode.com/soybeanjs/soybean-admin/tree/legacy)


## 文档

- [地址](https://docs.soybeanjs.cn)
- [旧版文档](https://legacy-docs.soybeanjs.cn)


## 使用

**环境准备**

确保你的环境满足以下要求：

- **git**: 你需要git来克隆和管理项目版本。
- **NodeJS**: >=20.19.0，推荐 20.19.0 或更高。
- **pnpm**: >= 10.5.0，推荐 10.5.0 或更高。

**克隆项目**

```bash
# github
git clone https://github.com/soybeanjs/soybean-admin.git
# gitee
git clone https://gitee.com/honghuangdc/soybean-admin.git
# gitcode
git clone https://gitcode.com/soybeanjs/soybean-admin.git
```

**安装依赖**

```bash
注意一定要在cmd窗口执行，不要在powerShell窗口执行
不需要管理员权限，只在当前 CMD 生效，关掉窗口就恢复。
set PATH=D:\install\node-v24.13.0-win-x64;%PATH%
node -v
npm -v
pnpm -v
corepack enable
corepack prepare pnpm@10.5.0 --activate
pnpm i
```
> 由于本项目采用了 pnpm monorepo 的管理方式，因此请不要使用 npm 或 yarn 来安装依赖。

**启动项目**

```bash
pnpm dev
```

**构建项目**

```bash
pnpm build
```
