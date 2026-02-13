export default {
  extends: ['@commitlint/config-conventional'],
  prompt: {
    messages: {
      skip: '（按回车键跳过）',
      max: '（最多 %d 个字符）',
      min: '（最少 %d 个字符）',
      emptyWarning: '（%s 是必需的）',
      upperLimitWarning: '%s 超过上限 %d 个字符',
      lowerLimitWarning: '%s 少于下限 %d 个字符',
    },
    questions: {
      type: {
        description: '选择你要提交的更改类型',
        enum: {
          feat: {
            description: '一个新功能',
            title: 'Features',
            emoji: '✨',
          },
          fix: {
            description: '一个错误修复',
            title: 'Bug Fixes',
            emoji: '🐛',
          },
          docs: {
            description: '仅文档更改',
            title: 'Documentation',
            emoji: '📚',
          },
          style: {
            description: '不影响代码含义的更改（空格、格式、缺失的分号等）',
            title: 'Styles',
            emoji: '💎',
          },
          refactor: {
            description: '既不修复错误也不添加功能的代码更改',
            title: 'Code Refactoring',
            emoji: '📦',
          },
          perf: {
            description: '提高性能的代码更改',
            title: 'Performance Improvements',
            emoji: '🚀',
          },
          test: {
            description: '添加缺失的测试或更正现有的测试',
            title: 'Tests',
            emoji: '🚨',
          },
          build: {
            description: '影响构建系统或外部依赖的更改（例如：gulp、broccoli、npm）',
            title: 'Builds',
            emoji: '🛠',
          },
          ci: {
            description:
              '对我们的 CI 配置文件和脚本的更改（例如：Travis、Circle、BrowserStack、SauceLabs）',
            title: 'Continuous Integrations',
            emoji: '⚙️',
          },
          chore: {
            description: '其他不修改 src 或测试文件的更改',
            title: 'Chores',
            emoji: '♻️',
          },
          revert: {
            description: '还原之前的提交',
            title: 'Reverts',
            emoji: '🗑',
          },
        },
      },
      scope: {
        description: '更改的范围是什么（例如：组件或文件名）',
      },
      subject: {
        description: '用简短的祈使句写下更改的描述',
      },
      body: {
        description: '提供更长的更改描述',
      },
      isBreaking: {
        description: '是否有重大更改？',
      },
      breakingBody: {
        description: '重大更改（BREAKING CHANGE）提交需要详细描述。请输入提交本身的更长描述',
      },
      breaking: {
        description: '描述重大更改',
      },
      isIssueAffected: {
        description: '此更改是否影响任何未解决的问题？',
      },
      issuesBody: {
        description: '如果问题被关闭，提交需要详细描述。请输入提交本身的更长描述',
      },
      issues: {
        description: '添加问题引用（例如：fix #123、re #123）',
      },
    },
  },
};
