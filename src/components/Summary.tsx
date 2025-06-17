import { useState, useEffect } from 'react';
import { Spin, Typography } from 'antd';
import '../styles/summary.css'

const { Text } = Typography;

const Summary: React.FC = () => {
  // State for current displayed content (HTML string)
  const [content, setContent] = useState('');
  // State for initial loading (shows Spin)
  const [isLoading, setIsLoading] = useState(true);
  // State for generation phase (shows "generating" message)
  const [isThinking, setIsThinking] = useState(false);

  // Extended fake formatted summary data (HTML with className)
  const fullContent = `
    <h2 class="summary-title">文档摘要</h2>
    <p class="summary-paragraph"><strong>引言</strong>：本文档深入探讨了人工智能（AI）在全球企业中的广泛应用，涵盖技术趋势、实施挑战、行业案例、政策影响、伦理考量及未来发展方向，为企业决策者、技术团队和政策制定者提供全面的战略洞察。</p>
    <h3 class="summary-subtitle">背景与现状</h3>
    <p class="summary-paragraph">人工智能自 2010 年代以来快速发展，受益于云计算、大数据和 GPU 算力的显著提升。从智能客服到供应链优化，AI 正在重塑商业模式、提升运营效率并创造新的市场价值。</p>
    <p class="summary-paragraph"><strong>市场概况</strong>：根据 2024 年行业报告，全球 AI 市场规模已达 5200 亿美元，预计到 2030 年突破 1.8 万亿美元，年复合增长率（CAGR）为 28%。生成式 AI 和边缘计算是主要增长动力。</p>
    <h3 class="summary-subtitle">核心发现</h3>
    <ul class="summary-list">
      <li class="summary-list-item"><strong>效率提升</strong>：AI 在数据分析、预测建模和流程自动化中降低 25%-30% 的运营成本，尤其在制造业、物流和服务业表现突出。</li>
      <li class="summary-list-item"><strong>隐私与伦理</strong>：数据隐私法规（如 GDPR、CCPA）和 AI 伦理问题（如算法偏见、决策透明度）是主要障碍，需加强合规性和公众信任。</li>
      <li class="summary-list-item"><strong>生成式 AI</strong>：生成式 AI（如大型语言模型、图像生成、语音合成）在内容创作、产品设计和客户交互中应用广泛，2026 年市场份额预计增长 40%。</li>
      <li class="summary-list-item"><strong>行业差异</strong>：医疗（疾病诊断、药物研发）、金融（欺诈检测、投资分析）、零售（个性化推荐）、教育（智能教学系统）和交通（自动驾驶）是 AI 应用的核心领域，各行业需求驱动定制化创新。</li>
      <li class="summary-list-item"><strong>人才短缺</strong>：全球 AI 专业人才缺口约 120 万，企业和高校需加大培养力度，预计 2030 年前仍将供不应求。</li>
      <li class="summary-list-item"><strong>能源消耗</strong>：AI 模型训练和推理的能源需求激增，数据中心能耗占全球用电量的 2%，推动绿色 AI 技术研发。</li>
    </ul>
    <h3 class="summary-subtitle">技术趋势</h3>
    <p class="summary-paragraph">当前，AI 发展的核心技术领域包括：</p>
    <ol class="summary-list-ordered">
      <li class="summary-list-item"><strong>深度学习</strong>：驱动图像识别、语音处理和复杂模式识别，广泛应用于医疗影像和自动驾驶。</li>
      <li class="summary-list-item"><strong>自然语言处理（NLP）</strong>：支持聊天机器人、文本分析、实时翻译，提升客户服务和内容生成效率。</li>
      <li class="summary-list-item"><strong>边缘 AI</strong>：通过边缘计算实现低延迟实时处理，应用于智能物联网设备、自动驾驶和工业自动化。</li>
      <li class="summary-list-item"><strong>AutoML</strong>：自动化机器学习降低开发门槛，使非专业人士也能构建 AI 模型，推动中小型企业采用。</li>
    </ol>
    <p class="summary-paragraph">此外，低代码 AI 平台、联邦学习（保护数据隐私）和量子计算的初步应用正在为 AI 发展注入新动力。</p>
    <table class="summary-table">
      <tr>
        <th>行业</th>
        <th>主要技术</th>
        <th>应用案例</th>
        <th>市场占比</th>
        <th>增长潜力</th>
      </tr>
      <tr>
        <td>医疗</td>
        <td>深度学习、NLP</td>
        <td>疾病诊断、药物研发、患者数据分析</td>
        <td>25%</td>
        <td>高</td>
      </tr>
      <tr>
        <td>金融</td>
        <td>NLP、预测建模</td>
        <td>欺诈检测、智能投顾、风险评估</td>
        <td>20%</td>
        <td>中</td>
      </tr>
      <tr>
        <td>零售</td>
        <td>推荐系统、计算机视觉</td>
        <td>个性化营销、库存管理、视觉搜索</td>
        <td>15%</td>
        <td>高</td>
      </tr>
      <tr>
        <td>教育</td>
        <td>NLP、推荐系统</td>
        <td>智能教学、个性化学习、自动评分</td>
        <td>10%</td>
        <td>中</td>
      </tr>
    </table>
    <h3 class="summary-subtitle">案例分析</h3>
    <p class="summary-paragraph">以医疗行业为例，AI 在疾病诊断中的应用显著提高了准确率。例如，基于深度学习的影像分析系统可检测早期癌症，误诊率降低至 5% 以下。此外，NLP 技术在电子病历（EMR）分析中实现了自动化提取，节省了 30% 的医生时间。</p>
    <p class="summary-paragraph">在金融领域，AI 驱动的欺诈检测系统通过实时分析交易模式，减少了 40% 的欺诈损失。智能投顾平台则为客户提供了低成本、高回报的投资组合管理，吸引了大量零售投资者。</p>
    <h3 class="summary-subtitle">挑战与对策</h3>
    <p class="summary-paragraph">企业在部署 AI 时面临以下主要挑战：</p>
    <ul class="summary-list">
      <li class="summary-list-item"><strong>技术壁垒</strong>：AI 系统设计和集成复杂，需高水平技术团队支持。</li>
      <li class="summary-list-item"><strong>数据质量</strong>：低质量、碎片化或不完整的数据显著降低模型性能。</li>
      <li class="summary-list-item"><strong>初始成本</strong>：AI 开发和部署的初期投入高，中小型企业难以负担。</li>
      <li class="summary-list-item"><strong>监管压力</strong>：全球对 AI 的监管日益严格，涉及数据隐私、算法公平和责任归属。</li>
    </ul>
    <p class="summary-paragraph"><strong>对策建议</strong>：</p>
    <ol class="summary-list-ordered">
      <li class="summary-list-item">加强与技术供应商、高校和研究机构的合作，获取专业支持和创新资源。</li>
      <li class="summary-list-item">建立全面的数据治理框架，确保数据质量、隐私和安全性。</li>
      <li class="summary-list-item">采用云端 AI 服务（如 AWS SageMaker、Google Vertex AI），降低开发和维护成本。</li>
      <li class="summary-list-item">制定长期 AI 战略，平衡短期收益与长期技术创新。</li>
      <li class="summary-list-item">参与行业标准制定，主动适应监管要求，提升企业信誉。</li>
    </ol>
    <h3 class="summary-subtitle">政策与伦理影响</h3>
    <p class="summary-paragraph">全球各国正加速制定 AI 相关政策。例如，欧盟的《人工智能法案》（AI Act）对高风险 AI 系统提出了严格要求，而中国的 AI 治理框架强调数据安全和算法透明。企业需密切关注政策动态，确保合规运营。</p>
    <p class="summary-paragraph"><strong>伦理考量</strong>：AI 的决策公平性、透明度和责任归属是公众关注的焦点。例如，招聘算法中的性别偏见引发了广泛争议，促使企业采用可解释 AI（XAI）技术提升透明度。</p>
    <p class="summary-paragraph"><em>结论</em>：人工智能是企业数字化转型的核心驱动力，但其成功部署需克服技术、伦理、资源和监管的多重挑战。通过跨学科协作、全球监管协调和持续创新，AI 将推动商业和社会的可持续发展。</p>
    <blockquote class="summary-quote">
      “人工智能的未来在于其与人类的协同，而非替代。我们需以责任、创新和包容引领 AI 发展。” —— AI 伦理学家
    </blockquote>
    <blockquote class="summary-quote">
      “AI 技术的真正潜力在于解决全球性挑战，如气候变化、医疗公平和教育普及。” —— 技术未来学家
    </blockquote>
    <h3 class="summary-subtitle">未来展望</h3>
    <p class="summary-paragraph">未来十年，AI 将深度融入日常生活，驱动智能城市、个性化教育、精准医疗和可持续能源等领域的变革。生成式 AI、量子计算和人机交互技术的融合将开启新的创新浪潮。</p>
    <p class="summary-paragraph"><strong>企业战略</strong>：企业应抓住 AI 发展机遇，制定前瞻性战略，投资于技术研发、人才培养和生态合作，以在竞争中占据领先地位。</p>
    <table class="summary-table">
      <tr>
        <th>未来技术</th>
        <th>预期影响</th>
        <th>时间线</th>
      </tr>
      <tr>
        <td>量子 AI</td>
        <td>加速复杂问题求解，如药物发现</td>
        <td>2030-2035</td>
      </tr>
      <tr>
        <td>人机协作</td>
        <td>增强生产力和创造力</td>
        <td>2025-2030</td>
      </tr>
      <tr>
        <td>绿色 AI</td>
        <td>降低能耗，优化可持续性</td>
        <td>2028-2032</td>
      </tr>
    </table>
    <p class="summary-paragraph"><strong>最终愿景</strong>：通过技术与人文的结合，AI 将成为解决全球挑战的强大工具，为人类创造更美好的未来。</p>
  `;

  const characters = fullContent.split('');

  useEffect(() => {
    const thinkingTimer = setTimeout(() => {
      setIsLoading(false);
      setIsThinking(true);
    }, 2000);

    let index = 0;
    const generationTimer = setInterval(() => {
      if (index < characters.length) {
        setContent(prev => prev + characters[index]);
        index++;
      } else {
        clearInterval(generationTimer);
        setIsThinking(false);
      }
    }, 10); 

    return () => {
      clearTimeout(thinkingTimer);
      clearInterval(generationTimer);
    };
  }, []);

  return (
    <div className="p-4">
      {isLoading ? (
        <div className="flex justify-center items-center h-full">
          <Spin tip="模型加载中..." size="large" />
        </div>
      ) : isThinking ? (
        <div>
          <Text type="secondary" className="mb-2 block animate-pulse">
            模型正在生成摘要...
          </Text>
          <div
            className="transition-opacity duration-300 opacity-100"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      ) : (
        <div
          className="transition-opacity duration-300 opacity-100"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )}
    </div>
  );
};

export default Summary;