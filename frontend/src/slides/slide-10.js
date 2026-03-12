window.slideDataMap.set(10, `
<div class="w-[1440px] h-[810px] slide-bg shadow-2xl relative overflow-hidden">
    <div class="w-[1350px] h-[720px] mx-auto my-[45px] p-10">
        <h1 class="text-5xl font-bold text-primary mb-4">技术架构</h1>
        <h2 class="text-3xl font-semibold text-accent-1 mb-8">四层架构设计解析</h2>
        <div class="grid grid-cols-2 gap-6">
            <div class="bg-white/10 p-5 rounded-lg border-l-4 border-primary">
                <h3 class="text-2xl font-bold text-primary mb-3">第一层: Channels</h3>
                <p class="text-white font-semibold mb-2">频道层 - 连接外部世界的桥梁</p>
                <ul class="space-y-1 text-white/90 text-sm">
                    <li>• WhatsApp、Slack、飞书、微信等</li>
                    <li>• 平台适配器统一消息格式</li>
                    <li>• 接入新平台只需添加适配器</li>
                </ul>
            </div>
            <div class="bg-white/10 p-5 rounded-lg border-l-4 border-accent-1">
                <h3 class="text-2xl font-bold text-accent-1 mb-3">第二层: Gateway</h3>
                <p class="text-white font-semibold mb-2">网关层 - 系统的神经中枢</p>
                <ul class="space-y-1 text-white/90 text-sm">
                    <li>• 消息路由与会话管理</li>
                    <li>• 任务调度与并发执行</li>
                    <li>• 准确分发AI会话</li>
                </ul>
            </div>
            <div class="bg-white/10 p-5 rounded-lg border-l-4 border-accent-2">
                <h3 class="text-2xl font-bold text-accent-2 mb-3">第三层: Agent Runtime</h3>
                <p class="text-white font-semibold mb-2">代理运行时 - AI的思考核心</p>
                <ul class="space-y-1 text-white/90 text-sm">
                    <li>• 整合历史对话、系统指令</li>
                    <li>• 调用底层大语言模型</li>
                    <li>• 区分文本回复和工具调用</li>
                </ul>
            </div>
            <div class="bg-white/10 p-5 rounded-lg border-l-4 border-white/50">
                <h3 class="text-2xl font-bold text-white mb-3">第四层: Memory</h3>
                <p class="text-white font-semibold mb-2">记忆层 - 持久化存储系统</p>
                <ul class="space-y-1 text-white/90 text-sm">
                    <li>• 基于Markdown文件存储</li>
                    <li>• 向量检索混合关键词匹配</li>
                    <li>• 支持长期知识积累</li>
                </ul>
            </div>
        </div>
        <div class="mt-6 p-4 bg-primary/20 rounded text-center">
            <p class="text-white text-lg font-semibold">设计原则: 高内聚、低耦合、标准化接口、易于维护扩展</p>
        </div>
    </div>
</div>
`);
