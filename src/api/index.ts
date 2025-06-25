import axios, { AxiosInstance, AxiosResponse } from "axios";
import { message } from "antd";

// 读取环境变量中的 baseUrl，默认为测试环境
const baseURL = process.env.REACT_APP_API_URL || "http://19.30.0.214:8080";

// 创建 Axios 实例
const api: AxiosInstance = axios.create({
  baseURL,
  timeout: 10000, // 设置超时时间为 10 秒
  headers: {
    "Content-Type": "application/json",
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 可添加认证头（如 token）
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // 统一处理响应数据
    const { code, message: msg } = response.data;
    if (code !== "200") {
      message.error(msg || "请求失败");
      return Promise.reject(new Error(msg));
    }
    return response.data;
  },
  (error) => {
    message.error("网络错误，请稍后重试");
    return Promise.reject(error);
  }
);

// 上传文献接口
export const uploadDocument = async (
  file: File,
  params?: {
    build_rounds?: number;
    papers_per_topic?: number;
    papers_per_author?: number;
    papers_per_reference?: number;
  }
) => {
  const formData = new FormData();
  formData.append("file", file);
  if (params?.build_rounds)
    formData.append("build_rounds", params?.build_rounds.toString());
  if (params?.papers_per_topic)
    formData.append("papers_per_topic", params?.papers_per_topic.toString());
  if (params?.papers_per_author)
    formData.append("papers_per_author", params?.papers_per_author.toString());
  if (params?.papers_per_reference)
    formData.append(
      "papers_per_reference",
      params?.papers_per_reference.toString()
    );

  // 恢复：使用假数据
  // return Promise.resolve({
  //   code: "200",
  //   message: "文件入库成功",
  // });

  // 实际接口调用
  return api.post('/analyze-pdf', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// 获取任务列表接口
export const getTaskList = async (
  pageNo: number = 1,
  pageSize: number = 10
) => {
  // 恢复：使用假数据
  // return Promise.resolve({
  //   code: "200",
  //   message: "成功",
  //   result: [
  //     {
  //       id: 2017427483,
  //       filename: "3.pdf",
  //       file_path: "http://19.30.0.214:8080/files/3.pdf",
  //       analy_flag: "1",
  //       graph_flag: "1",
  //       createTime: "2025-06-25 12:00:00",
  //     },
  //     {
  //       id: 2017427476,
  //       filename: "1.pdf",
  //       analy_flag: "2",
  //       graph_flag: "2",
  //       createTime: "2025-06-20 09:19:03",
  //     },
  //     {
  //       id: 2017427482,
  //       filename: "1.pdf",
  //       analy_flag: "2",
  //       graph_flag: "2",
  //       createTime: "2025-06-24 11:11:07",
  //     },
  //   ],
  //   total: 2,
  //   pageNo: 1,
  //   pageSize: 10,
  // });

  // 实际接口调用
  return api.get<any, any>('/ocean/list', { params: { pageNo, pageSize } });
};

// 获取详细分析结果接口
export const getAnalysisResult = async (id: number) => {
  // 恢复：使用假数据
  // return Promise.resolve({
  //   code: "200",
  //   message: "成功",
  //   result: {
  //     filename: "1.pdf",
  //     related_literature_queries: {
  //       topics: ["大型底栖动物", "群落结构", "环境因子", "莱州湾", "渤海"],
  //       authors: [
  //         "赵华",
  //         "徐勇",
  //         "李新正",
  //         "韩庆喜",
  //         "张悦",
  //         "王金宝",
  //         "隋吉星",
  //       ],
  //     },
  //     paper_guide: {
  //       summary:
  //         "结合提供的多个摘要信息，可以整合出以下完整的全文摘要：\n\n基于2023年7月对莱州湾昌邑海域东、西两个调查断面的大型底栖动物及环境资料的研究，本文探讨了该海域大型底栖动物群落结构的差异及其影响因素。研究发现，西侧断面的生物量、Margalef丰富度指数和Shannon-Wiener多样性指数显著高于东侧断面，且多毛类动物自2019年以来成为主要物种。通过聚类分析和非度量多维尺度（NMDS）排序，东、西两个断面被划分为两个不同的群组，PERMANOVA分析显示两群组间存在显著差异，SIMPER分析指出中华半突虫（Phyllodoce chinensis）和彩虹蛤（Iridona iridescens）为主要贡献种。Mantel分析揭示软体动物受环境变量影响最大，典范对应分析（CCA）表明沉积物中值粒径、铁含量、总氮含量以及水体中的亚硝酸盐浓度、温度和pH值是影响大型底栖动物群落的关键因素。此外，与历史数据对比，昌邑海域的大型底栖动物物种数量低于莱州湾整体及其他局部海域，反映出该区域可能面临特定的生态环境压力。本次研究共记录到55种大型底栖生物，包括24种多毛纲、14种软体动物、12种甲壳纲等。总体而言，温度和沉积物特性是决定莱州湾昌邑海域大型底栖动物群落空间分布的关键因素。这项研究不仅补充了莱州湾尤其是昌邑近海区域大型底栖动物调查的不足，也为理解该海域的生态环境现状提供了重要依据，并有助于推动海洋生物多样性的保护工作。\n\n关键词：大型底栖生物；群落结构；环境因素；莱州湾；渤海",
  //       keywords: ["大型底栖动物", "群落结构", "环境因子", "莱州湾", "渤海"],
  //       is_translation_from_english: false,
  //       knowledge_points: [
  //         {
  //           concept: "大型底栖动物",
  //           description:
  //             "指不能通过0.5mm孔径筛网的底栖动物，它们是海洋生态系统的重要组成部分，参与生物地球化学循环，维持海洋生态系统的结构与功能，并在海洋食物链中扮演重要角色。",
  //         },
  //         {
  //           concept: "群落结构",
  //           description:
  //             "描述了特定区域内生物种类的组成、数量比例、空间分布及其相互作用关系，本研究中涉及大型底栖动物的物种组成、优势种、丰度、生物量和多样性等指标。",
  //         },
  //         {
  //           concept: "环境因子",
  //           description:
  //             "包括沉积物中值粒径、铁、总氮、亚硝酸盐、温度和pH等，这些因子能够显著影响大型底栖动物群落结构和分布。",
  //         },
  //         {
  //           concept: "莱州湾",
  //           description:
  //             "位于渤海南部，山东半岛北部，是一个重要的海洋大型底栖动物栖息地，受到多种环境和人为因素的影响。",
  //         },
  //         {
  //           concept: "主成分分析(PCA)",
  //           description:
  //             "一种统计方法，用于简化数据集中的变量，通过减少数据维度来识别潜在的结构或模式。",
  //         },
  //         {
  //           concept: "Margalef丰富度指数",
  //           description:
  //             "衡量一个群落中物种多样性的指标之一，数值越大表示物种越丰富。",
  //         },
  //         {
  //           concept: "Shannon-Wiener多样性指数",
  //           description:
  //             "用来量化生物多样性的一个常用指数，考虑了物种的数量和相对丰度。",
  //         },
  //         {
  //           concept: "Pielou均匀度指数",
  //           description:
  //             "评估物种分布均匀程度的指数，反映了群落中物种丰度的均衡性。",
  //         },
  //         {
  //           concept: "PERMANOVA分析",
  //           description:
  //             "一种基于距离矩阵的多元方差分析方法，用于检验不同样本组之间的差异是否显著。",
  //         },
  //         {
  //           concept: "SIMPER分析",
  //           description:
  //             "用于确定不同样本组之间差异的主要贡献种，帮助理解群落结构差异的原因。",
  //         },
  //         {
  //           concept: "Mantel分析",
  //           description:
  //             "一种统计测试，用于检测两个距离矩阵之间的相关性，常用于生态学研究中探索环境变量与生物群落结构的关系。",
  //         },
  //         {
  //           concept: "CCA分析",
  //           description:
  //             "典范对应分析，是一种多变量统计方法，用于研究环境变量与物种分布之间的关系。",
  //         },
  //       ],
  //     },
  //     mind_map_data: {
  //       topic: "文章结构分析",
  //       children: [
  //         {
  //           topic: "摘要",
  //           children: [
  //             {
  //               topic:
  //                 "基于2023年7月莱州湾昌邑海域东、西两个调查断面的数据，研究了大型底栖动物的物种组成、优势种、丰度、生物量和多样性。",
  //               children: null,
  //             },
  //             {
  //               topic:
  //                 "西侧调查断面的生物量、Margalef丰富度指数和Shannon-Wiener多样性指数均显著高于东侧断面。",
  //               children: null,
  //             },
  //             {
  //               topic:
  //                 "CCA分析表明，沉积物中值粒径、铁和总氮以及水体亚硝酸盐、温度和pH是影响大型底栖动物群落结构的关键环境因子。",
  //               children: null,
  //             },
  //             {
  //               topic:
  //                 "西侧C断面的群落组成与东侧B断面存在显著差异，优势种包括彩虹蛤(Iridona iridescens)和刚鳃虫(Chaetozone setosa)等。",
  //               children: null,
  //             },
  //             {
  //               topic:
  //                 "与历史资料对比发现，昌邑海域大型底栖动物的物种数量少于莱州湾整体及其他局部海域。",
  //               children: null,
  //             },
  //           ],
  //         },
  //         {
  //           topic: "引言",
  //           children: [
  //             {
  //               topic:
  //                 "本文基于2023年7月莱州湾昌邑海域东、西两个调查断面的数据，研究了大型底栖动物的物种组成、优势种、丰度、生物量和多样性。",
  //               children: null,
  //             },
  //             {
  //               topic:
  //                 "莱州湾昌邑海域是海洋大型底栖动物的重要栖息地，但受到渔业捕捞、近海养殖等多种人类活动的影响，其生态环境正在发生变化。",
  //               children: null,
  //             },
  //             {
  //               topic:
  //                 "以往研究中，关于莱州湾大型底栖动物群落结构的影响因素已有探讨，但缺乏对昌邑近岸海域的专门调查，本研究填补了这一空白。",
  //               children: null,
  //             },
  //             {
  //               topic:
  //                 "西侧调查断面的物种数、丰度、生物量和多样性指数均高于东侧断面，显示出明显的生态差异。",
  //               children: null,
  //             },
  //             {
  //               topic:
  //                 "CCA分析表明，沉积物中值粒径、铁、总氮、水体亚硝酸盐、温度和pH是影响大型底栖动物群落结构的关键环境变量。",
  //               children: null,
  //             },
  //           ],
  //         },
  //         {
  //           topic: "材料和方法",
  //           children: [
  //             {
  //               topic:
  //                 "使用0.1平方米的抓斗采泥器在莱州湾昌邑海域的东、西两个调查断面的10个站位采集沉积物样品。",
  //               children: null,
  //             },
  //             {
  //               topic:
  //                 "对采集的沉积物样品进行了多项物理和化学指标的测定，包括中值粒径、总有机碳、总氮、沉积物石油烃、重金属（铜、铅、锌、镉、铬、砷、锰、铁、钴）和磷含量。",
  //               children: null,
  //             },
  //             {
  //               topic:
  //                 "利用R语言中的FactoMineR包进行主成分分析(PCA)，并对环境数据进行ln转换和标准化处理。",
  //               children: null,
  //             },
  //             {
  //               topic:
  //                 "通过聚类分析(Cluster)和非参数多维标度排序(NMDS)来分析站位之间的差异性，并使用PERMANOVA检验站位之间差异是否显著。",
  //               children: null,
  //             },
  //             {
  //               topic:
  //                 "筛选出与大型底栖动物显著相关的环境变量，包括沉积物中值粒径、铁、总氮、水体亚硝酸盐、温度和pH，来进行物种丰度矩阵与环境因子矩阵的典范对应分析(CCA)。",
  //               children: null,
  //             },
  //           ],
  //         },
  //         {
  //           topic: "结果",
  //           children: [
  //             {
  //               topic:
  //                 "西侧调查断面(C断面)的物种数、丰度、生物量、Margalef丰富度指数(D)和Shannon-Wiener多样性指数(H′)均显著高于东侧调查断面(B断面)。",
  //               children: null,
  //             },
  //             {
  //               topic:
  //                 "CCA分析显示，沉积物中值粒径、铁、总氮及水体亚硝酸盐、温度和pH是影响大型底栖动物群落结构的关键环境变量。",
  //               children: null,
  //             },
  //             {
  //               topic:
  //                 "铁、总氮和温度这三个环境变量对大型底栖动物群落物种组成变化的解释比例超过16.50%，总计解释比例为45.81%。",
  //               children: null,
  //             },
  //             {
  //               topic:
  //                 "西侧C断面的温度高于东侧B断面，这可能是造成两断面群落结构差异的一个重要因素。",
  //               children: null,
  //             },
  //             {
  //               topic:
  //                 "SIMPER分析表明，中华半突虫(Phyllodoce chinensis)和彩虹蛤(Iridona iridescens)等物种对东、西断面群落结构的差异贡献最大。",
  //               children: null,
  //             },
  //           ],
  //         },
  //         {
  //           topic: "讨论",
  //           children: [
  //             {
  //               topic:
  //                 "西侧C断面的物种数、丰度、生物量和多样性均高于东侧B断面。",
  //               children: null,
  //             },
  //             {
  //               topic:
  //                 "莱州湾昌邑海域大型底栖动物群落结构在东、西两个调查断面存在显著差异，这种差异可能与温度等因素有关。",
  //               children: null,
  //             },
  //             {
  //               topic:
  //                 "沉积物和水体环境变量共同主导了莱州湾昌邑海域大型底栖动物群落结构的变化。",
  //               children: null,
  //             },
  //             {
  //               topic:
  //                 "铁、总氮和温度是影响大型底栖动物群落结构的关键环境变量。",
  //               children: null,
  //             },
  //             {
  //               topic:
  //                 "软体动物群落受到的环境变量影响最多，推测其移动能力较弱，因此更容易受到环境变化的影响。",
  //               children: null,
  //             },
  //           ],
  //         },
  //         {
  //           topic: "致谢",
  //           children: [
  //             {
  //               topic:
  //                 "感谢中国科学院海洋研究所分类与系统演化实验室甲壳动物分类与大型底栖生物课题组成员在出海调查工作中的辛勤付出。",
  //               children: null,
  //             },
  //             {
  //               topic:
  //                 "感谢课题组内部成员在样品处理和数据分析方面的支持与帮助。",
  //               children: null,
  //             },
  //             {
  //               topic: "特别感谢审稿专家提供的宝贵修改意见。",
  //               children: null,
  //             },
  //           ],
  //         },
  //         {
  //           topic: "参考文献",
  //           children: [
  //             {
  //               topic:
  //                 "Mantel 分析表明, 多毛类动物群落与硅酸盐、总氮、总有机碳、温度、溶解氧和pH 显著相关。",
  //               children: null,
  //             },
  //             {
  //               topic:
  //                 "影响软体动物的环境变量最多, 包括中值粒径、黏土、粉砂、细砂、钴、铜、锌、铁、总氮、总有机碳、温度和溶解氧。",
  //               children: null,
  //             },
  //             {
  //               topic:
  //                 "CCA 分析表明, 沉积物中值粒径、铁和总氮及水体亚硝酸盐、温度和pH 能够显著影响大型底栖动物群落。",
  //               children: null,
  //             },
  //             {
  //               topic: "铁、总氮和温度解释群落物种组成变化的比例均超过16.50%。",
  //               children: null,
  //             },
  //             {
  //               topic:
  //                 "沉积物重金属含量在大型底栖动物群落结构形成方面起着重要作用。",
  //               children: null,
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //     graph_data: {
  //       nodes: [
  //         {
  //           id: "paper_original_seed_paper.pdf",
  //           label: "一篇关于AI的论文",
  //           type: "original_paper",
  //           details: {},
  //         },
  //         {
  //           id: "author_张三",
  //           label: "张三",
  //           type: "author",
  //           details: {},
  //         },
  //         {
  //           id: "keyword_人工智能",
  //           label: "人工智能",
  //           type: "keyword",
  //           details: {},
  //         },
  //         {
  //           id: "paper_sim_1a2b3c4d",
  //           label: "Simulated Paper on 人工智能",
  //           type: "related_paper",
  //           details: {},
  //         },
  //       ],
  //       edges: [
  //         {
  //           source: "paper_original_seed_paper.pdf",
  //           target: "author_张三",
  //           label: "作者是",
  //         },
  //         {
  //           source: "paper_original_seed_paper.pdf",
  //           target: "keyword_人工智能",
  //           label: "包含主题",
  //         },
  //         {
  //           source: "keyword_人工智能",
  //           target: "paper_sim_1a2b3c4d",
  //           label: "相关文献",
  //         },
  //       ],
  //     },
  //   },
  // });

  // 实际接口调用
  return api.get<any, any>('/ocean/selectById', { params: { id } });
};

// 删除任务接口
export const deleteTask = async (id: number) => {
  // 恢复：使用假数据
  // return Promise.resolve({
  //   code: "200",
  //   message: "删除成功",
  // });

  // 实际接口调用
  return api.delete<any, any>('/ocean/delete', { params: { id } });
};

export default api;
