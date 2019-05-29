<template>
  <div>
    <h1>基于快速原型开发</h1>
    <p>可以查看终端 vue命令 </p>

    <pre class="language-text">
      <code>
        Usage: vue <command/> [options]

        Options:
          -V, --version                         output the version number
          -h, --help                            output usage information

        Commands:
          create [options] &lt;app-name&gt;           create a new project powered by vue-cli-service
          add &lt;plugin/&gt; [pluginOptions]          install a plugin and invoke its generator in an already created project
          invoke &lt;plugin/&gt; [pluginOptions]       invoke the generator of a plugin in an already created project
          inspect [options] [paths...]          inspect the webpack config in a project with vue-cli-service
          serve [options] [entry]               serve a .js or .vue file in development mode with zero config
          build [options] [entry]               build a .js or .vue file in production mode with zero config
          ui [options]                          start and open the vue-cli ui
          init [options] &lt;template/&gt; &lt;app-name/&gt;  generate a project from a remote template (legacy API, requires @vue/cli-init)
          config [options] [value]              inspect and modify the config

          Run vue &lt;command/&gt; --help for detailed usage of given command.
      </code>
    </pre>

    <mavon-editor
      v-html="value"
      :subfield="false"
      :defaultOpen="defaultData"
      :toolbarsFlag="false"
      :boxShadow="true"
      @change="changeData"
    />
  </div>
</template>


<script>
import mavonEditor from "mavon-editor";
import "mavon-editor/dist/css/index.css";
import Vue from "vue";
Vue.use(mavonEditor);
export default {
  data() {
    return {
      //value的值是经过markdown解析后的文本，可使用`@change="changeData"`在控制台打印显示
      value: `<blockquote>
              <p>你好</p>
              </blockquote>
              <p><code>java</code></p>`,
      defaultData: "preview"
    };
  },
  // 下面报错，为何
  // methods: {
  //   changeData(value, render) {
  //     console.log(render);
  //   }
  // }
};
</script>