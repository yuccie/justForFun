## webpack流程

1. 接受配置选项，并格式化配置
2. 挂载并注册内置插件及传入的插件
3. 编译入口文件至AST，并递归分析依赖
4. 将AST转为es5代码
5. 将代码包装，并写入输出的文件目录

- babylon将代码转为AST
- babel-core将AST转为源码
- 通过babel-traverse的importDeclaration分析依赖
- 包装代码，让其可以再浏览器里运行

## 项目结构

- lib是webpack的源码
- src是项目的源码，其实就是将这些源码通过webpack打包处理
- simple.config.js就是配置，可以模仿webpack的配置写

## 步骤

### 步骤一

先写项目大概结构，以及src源码

### 步骤二

- webpack源码需要读取配置文件，因此需要将配置文件引入，注意这些配置都是commonjs规范

