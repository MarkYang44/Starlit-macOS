/* ============================================================
   星伴 自建聊天客户端
   - 同一个页面既是页面也是 OneBot 11 客户端（正向 WS）
   - 只做私聊：登录者=我，唯一好友=星野
   ============================================================ */
(() => {
  'use strict';

  // ---------------------------------------------------------- 基础
  const $ = (sel) => document.querySelector(sel);
  const LS_THEME = 'vol.theme';
  const LS_TOKEN = 'vol.token';
  const LS_IMMERSION = 'vol.immersion';
  const LS_CONV_PREFS = 'vol.convPrefs';
  const LS_CONV_DRAFTS = 'vol.convDrafts';
  const LS_NOTIFICATIONS = 'vol.notifications';
  const LS_RECENT_STICKERS = 'vol.recentStickers';
  const LS_APPEARANCE = 'vol.appearance';

  function readLocalMap(key) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || '{}');
      return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
    } catch (e) { return {}; }
  }

  function readLocalArray(key) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || '[]');
      return Array.isArray(value)
        ? value.filter((item) => typeof item === 'string' && item)
        : [];
    } catch (e) { return []; }
  }

  const els = {
    connectView: $('#connectView'),
    connectState: $('#connectState'),
    connectStateText: $('#connectStateText'),
    connectBtn: $('#connectBtn'),
    tokenRow: $('#tokenRow'),
    tokenInput: $('#tokenInput'),
    tokenSave: $('#tokenSave'),
    connectTip: $('#connectTip'),

    appView: $('#appView'),
    connectBg: $('#connectBg'),
    connectBgPick: $('#connectBgPick'),
    connectBgInput: $('#connectBgInput'),
    brandAvatar: $('#brandAvatar'),
    railAvatar: $('#railAvatar'),
    railDot: $('#railDot'),
    railMessages: $('#railMessages'),
    railContacts: $('#railContacts'),
    railTheme: $('#railTheme'),
    railSticker: $('#railSticker'),
    railSettings: $('#railSettings'),
    mobileTheme: $('#mobileTheme'),
    mobileSettings: $('#mobileSettings'),

    meName: $('#meName'),
    presenceChip: $('#presenceChip'),
    presenceChipText: $('#presenceChipText'),
    connChip: $('#connChip'),
    connChipText: $('#connChip span'),
    searchInput: $('#searchInput'),
    globalSearchPanel: $('#globalSearchPanel'),
    globalSearchStatus: $('#globalSearchStatus'),
    globalSearchResults: $('#globalSearchResults'),
    listPane: $('#listPane'),
    listHead: $('#listHead'),
    listFoot: $('#listFoot'),
    convList: $('#convList'),
    desktopContacts: $('#desktopContacts'),
    desktopContactSearch: $('#desktopContactSearch'),
    desktopContactCount: $('#desktopContactCount'),
    desktopContactList: $('#desktopContactList'),
    verText: $('#verText'),

    chatPane: $('#chatPane'),
    backBtn: $('#backBtn'),
    chatName: $('#chatName'),
    chatSub: $('#chatSub'),
    onlineDot: $('#onlineDot'),
    btnChatStyle: $('#btnChatStyle'),
    btnSearchMsg: $('#btnSearchMsg'),
    btnMore: $('#btnMore'),
    chatSearch: $('#chatSearch'),
    chatSearchInput: $('#chatSearchInput'),
    searchCount: $('#searchCount'),
    searchClose: $('#searchClose'),
    chatSearchBody: $('#chatSearchBody'),
    chatSearchStatus: $('#chatSearchStatus'),
    chatSearchError: $('#chatSearchError'),
    chatSearchErrorText: $('#chatSearchErrorText'),
    searchRetry: $('#searchRetry'),
    chatSearchResults: $('#chatSearchResults'),
    searchMore: $('#searchMore'),

    msgScroll: $('#msgScroll'),
    msgList: $('#msgList'),
    emptyState: $('#emptyState'),
    emptyAvatar: $('#emptyAvatar'),
    toBottom: $('#toBottom'),
    toBottomBadge: $('#toBottomBadge'),
    multiBar: $('#multiBar'),
    multiCount: $('#multiCount'),
    marqueeBox: $('#marqueeBox'),
    forwardMask: $('#forwardMask'),
    forwardTitle: $('#forwardTitle'),
    forwardList: $('#forwardList'),
    forwardClose: $('#forwardClose'),

    composer: $('#composer'),
    input: $('#input'),
    sendBtn: $('#sendBtn'),
    mobileMoreBtn: $('#mobileMoreBtn'),
    emojiBtn: $('#emojiBtn'),
    stickerBtn: $('#stickerBtn'),
    imageBtn: $('#imageBtn'),
    fileInput: $('#fileInput'),
    voiceBtn: $('#voiceBtn'),
    voiceRecorder: $('#voiceRecorder'),
    composerBox: $('#composerBox'),
    voiceCancel: $('#voiceCancel'),
    voiceRecordDot: $('#voiceRecordDot'),
    voiceStatus: $('#voiceStatus'),
    voiceTime: $('#voiceTime'),
    voicePreview: $('#voicePreview'),
    voiceStop: $('#voiceStop'),
    voiceSend: $('#voiceSend'),
    voiceHoldBar: $('#voiceHoldBar'),
    voiceHoldText: $('#voiceHoldText'),
    voiceHoldTime: $('#voiceHoldTime'),

    emojiPanel: $('#emojiPanel'),
    emojiTabs: $('#emojiTabs'),
    emojiGrid: $('#emojiGrid'),
    stickerPanel: $('#stickerPanel'),
    stickerTabs: $('#stickerTabs'),
    stickerGrid: $('#stickerGrid'),
    stickerSearch: $('#stickerSearch'),
    stickerEmpty: $('#stickerEmpty'),
    stickerManageBtn: $('#stickerManageBtn'),
    stickerManageBar: $('#stickerManageBar'),
    stickerAddBtn: $('#stickerAddBtn'),
    stickerCategoryAdd: $('#stickerCategoryAdd'),
    stickerCategoryDel: $('#stickerCategoryDel'),
    stickerUploadInput: $('#stickerUploadInput'),
    categoryMask: $('#categoryMask'),
    categoryClose: $('#categoryClose'),
    categoryCancel: $('#categoryCancel'),
    categoryName: $('#categoryName'),
    categoryCreate: $('#categoryCreate'),

    mobileAvatar: $('#mobileAvatar'),
    mobileName: $('#mobileName'),
    mobileStatus: $('#mobileStatus'),
    mobileDot: $('#mobileDot'),
    mobilePresence: $('#mobilePresence'),
    mobilePlus: $('#mobilePlus'),
    mobileNav: $('#mobileNav'),
    navBadge: $('#navBadge'),
    contactsPage: $('#contactsPage'),
    contactsBack: $('#contactsBack'),
    contactsAdd: $('#contactsAdd'),
    contactList: $('#contactList'),
    mobileActions: $('#mobileActions'),
    mobileComposerActions: $('#mobileComposerActions'),
    mobileGlobalActions: $('#mobileGlobalActions'),
    convActions: $('#convActions'),

    ctxMenu: $('#ctxMenu'),
    convMenu: $('#convMenu'),
    moreMenu: $('#moreMenu'),
    presenceMenu: $('#presenceMenu'),
    lightbox: $('#lightbox'),
    lightboxImg: $('#lightboxImg'),
    toast: $('#toast'),
    dropMask: $('#dropMask'),

    settingsMask: $('#settingsMask'),
    settingsClose: $('#settingsClose'),
    themeSeg: $('#themeSeg'),
    settingsImmersion: $('#settingsImmersion'),
    settingsDensity: $('#settingsDensity'),
    settingsFontSize: $('#settingsFontSize'),
    settingsSendKey: $('#settingsSendKey'),
    settingsChatStyle: $('#settingsChatStyle'),
    settingsNotifications: $('#settingsNotifications'),
    settingsNotificationState: $('#settingsNotificationState'),
    settingsToken: $('#settingsToken'),
    settingsTokenSave: $('#settingsTokenSave'),
    settingsApiKey: $('#settingsApiKey'),
    settingsBaseUrl: $('#settingsBaseUrl'),
    settingsModel: $('#settingsModel'),
    settingsApiState: $('#settingsApiState'),
    settingsLlmSave: $('#settingsLlmSave'),
    settingsLlmTest: $('#settingsLlmTest'),
    settingsLlmTestState: $('#settingsLlmTestState'),
    setupPanel: $('#setupPanel'),
    setupState: $('#setupState'),
    setupComplete: $('#setupComplete'),
    serviceSettingsState: $('#serviceSettingsState'),
    diagnosticsRefresh: $('#diagnosticsRefresh'),
    diagnosticsList: $('#diagnosticsList'),
    settingsTtsMode: $('#settingsTtsMode'),
    settingsTtsEndpoint: $('#settingsTtsEndpoint'),
    settingsTtsModel: $('#settingsTtsModel'),
    settingsTtsApiKey: $('#settingsTtsApiKey'),
    settingsTtsVoice: $('#settingsTtsVoice'),
    settingsTtsPrivacy: $('#settingsTtsPrivacy'),
    settingsTtsState: $('#settingsTtsState'),
    settingsTtsSave: $('#settingsTtsSave'),
    settingsTtsTest: $('#settingsTtsTest'),
    settingsTtsTestState: $('#settingsTtsTestState'),
    settingsAddCharacter: $('#settingsAddCharacter'),
    settingsBackup: $('#settingsBackup'),

    characterMask: $('#characterMask'),
    characterClose: $('#characterClose'),
    characterPreview: $('#characterPreview'),
    characterPickAvatar: $('#characterPickAvatar'),
    characterAvatarInput: $('#characterAvatarInput'),
    characterCardInput: $('#characterCardInput'),
    characterName: $('#characterName'),
    characterImport: $('#characterImport'),
    characterGenerate: $('#characterGenerate'),
    characterStatus: $('#characterStatus'),
    characterEditor: $('#characterEditor'),
    characterSeries: $('#characterSeries'),
    characterAliases: $('#characterAliases'),
    characterSummary: $('#characterSummary'),
    characterInterests: $('#characterInterests'),
    characterPersona: $('#characterPersona'),
    characterRevision: $('#characterRevision'),
    characterSaveDraft: $('#characterSaveDraft'),
    characterTrialLog: $('#characterTrialLog'),
    characterTrialInput: $('#characterTrialInput'),
    characterTrialSend: $('#characterTrialSend'),
    characterCancel: $('#characterCancel'),
    characterCreate: $('#characterCreate'),
    settingsUrl: $('#settingsUrl'),
    settingsReconnect: $('#settingsReconnect'),
    settingsStapxs: $('#settingsStapxs'),

    chatSettingsMask: $('#chatSettingsMask'),
    chatSettingsClose: $('#chatSettingsClose'),
    csAvatar: $('#csAvatar'),
    csTitle: $('#csTitle'),
    csSubTitle: $('#csSubTitle'),
    csChatBgPresets: $('#csChatBgPresets'),
    csChatBgPick: $('#csChatBgPick'),
    csChatBgReset: $('#csChatBgReset'),
    csChatBgInput: $('#csChatBgInput'),
    csChatBgStatus: $('#csChatBgStatus'),
    csSideSeg: $('#csSideSeg'),
    csStyles: $('#csStyles'),
    csCustom: $('#csCustom'),
    csColors: $('#csColors'),
    csBg1: $('#csBg1'),
    csBg2: $('#csBg2'),
    csFg: $('#csFg'),
    csResetColor: $('#csResetColor'),
    csTags: $('#csTags'),
    csTagInput: $('#csTagInput'),
    csDecos: $('#csDecos'),
    csDecoInput: $('#csDecoInput'),
    csStickerGroups: $('#csStickerGroups'),
    csPreviewIn: $('#csPreviewIn'),
    csPreviewOut: $('#csPreviewOut'),
    csPreviewInAvatar: $('#csPreviewInAvatar'),
    csPreviewOutAvatar: $('#csPreviewOutAvatar'),
    csAvatarPreview: $('#csAvatarPreview'),
    csAvatarPick: $('#csAvatarPick'),
    csAvatarReset: $('#csAvatarReset'),
    csEnthusiasm: $('#csEnthusiasm'),
    csEnthusiasmVal: $('#csEnthusiasmVal'),
    csAffection: $('#csAffection'),
    csAffectionVal: $('#csAffectionVal'),
    csInitiativeScale: $('#csInitiativeScale'),
    csInitiativeScaleVal: $('#csInitiativeScaleVal'),
    csQuietFor: $('#csQuietFor'),
    csQuietStatus: $('#csQuietStatus'),
    csLowPressure: $('#csLowPressure'),
    csTraitPreview: $('#csTraitPreview'),
    csTraitDetail: $('#csTraitDetail'),
    csTraitSave: $('#csTraitSave'),
    csVoiceEnabled: $('#csVoiceEnabled'),
    csVoiceAuto: $('#csVoiceAuto'),
    csVoiceId: $('#csVoiceId'),
    csVoiceSpeed: $('#csVoiceSpeed'),
    csVoiceSpeedVal: $('#csVoiceSpeedVal'),
    csVoiceHint: $('#csVoiceHint'),
    csVoiceSave: $('#csVoiceSave'),
    profileMask: $('#profileMask'),
    profileClose: $('#profileClose'),
    profileAvatar: $('#profileAvatar'),
    profileName: $('#profileName'),
    profileMood: $('#profileMood'),
    profileStats: $('#profileStats'),
    profileMemoriesBtn: $('#profileMemoriesBtn'),
    profilePersonaBtn: $('#profilePersonaBtn'),
    profileSharedLifeBtn: $('#profileSharedLifeBtn'),
    personaMask: $('#personaMask'),
    personaClose: $('#personaClose'),
    personaCancel: $('#personaCancel'),
    personaTitle: $('#personaTitle'),
    personaEditor: $('#personaEditor'),
    personaStatus: $('#personaStatus'),
    personaCount: $('#personaCount'),
    personaVersions: $('#personaVersions'),
    personaSave: $('#personaSave'),
    profileBondStatus: $('#profileBondStatus'),
    profileBondMeta: $('#profileBondMeta'),
    profileBondBtn: $('#profileBondBtn'),
    profileBondHint: $('#profileBondHint'),
    chatBondChip: $('#chatBondChip'),

    memoriesMask: $('#memoriesMask'),
    memoriesClose: $('#memoriesClose'),
    memoriesPeerName: $('#memoriesPeerName'),
    memoriesSearch: $('#memoriesSearch'),
    memoriesAddBtn: $('#memoriesAddBtn'),
    memoriesFilters: $('#memoriesFilters'),
    memoryEditor: $('#memoryEditor'),
    memoryEditorTitle: $('#memoryEditorTitle'),
    memoryEditorClose: $('#memoryEditorClose'),
    memoryEditorCancel: $('#memoryEditorCancel'),
    memoryEditorHint: $('#memoryEditorHint'),
    memoryText: $('#memoryText'),
    memoryCategory: $('#memoryCategory'),
    memoryPinned: $('#memoryPinned'),
    memoryFormError: $('#memoryFormError'),
    memorySave: $('#memorySave'),
    memoriesCount: $('#memoriesCount'),
    memoriesRefresh: $('#memoriesRefresh'),
    memoriesLoading: $('#memoriesLoading'),
    memoriesLoadingText: $('#memoriesLoadingText'),
    memoriesError: $('#memoriesError'),
    memoriesErrorText: $('#memoriesErrorText'),
    memoriesRetry: $('#memoriesRetry'),
    memoriesEmpty: $('#memoriesEmpty'),
    memoriesEmptyTitle: $('#memoriesEmptyTitle'),
    memoriesEmptyText: $('#memoriesEmptyText'),
    memoriesEmptyAdd: $('#memoriesEmptyAdd'),
    memoriesList: $('#memoriesList'),
    memoriesMore: $('#memoriesMore'),

    sharedLifeMask: $('#sharedLifeMask'),
    sharedLifeClose: $('#sharedLifeClose'),
    sharedLifeTitle: $('#sharedLifeTitle'),
    sharedLifePeerName: $('#sharedLifePeerName'),
    sharedLifeTabs: $('#sharedLifeTabs'),
    sharedLifeAnniversariesTab: $('#sharedLifeAnniversariesTab'),
    sharedLifeAgreementsTab: $('#sharedLifeAgreementsTab'),
    sharedLifeDiariesTab: $('#sharedLifeDiariesTab'),
    sharedLifeAnniversariesPanel: $('#sharedLifeAnniversariesPanel'),
    sharedLifeAgreementsPanel: $('#sharedLifeAgreementsPanel'),
    sharedLifeDiariesPanel: $('#sharedLifeDiariesPanel'),
    sharedLifeAnniversaryAdd: $('#sharedLifeAnniversaryAdd'),
    sharedLifeAnniversaryForm: $('#sharedLifeAnniversaryForm'),
    sharedLifeAnniversaryFormTitle: $('#sharedLifeAnniversaryFormTitle'),
    sharedLifeAnniversaryEditorClose: $('#sharedLifeAnniversaryEditorClose'),
    sharedLifeAnniversaryTitleInput: $('#sharedLifeAnniversaryTitleInput'),
    sharedLifeAnniversaryDate: $('#sharedLifeAnniversaryDate'),
    sharedLifeAnniversaryNote: $('#sharedLifeAnniversaryNote'),
    sharedLifeAnniversaryYearly: $('#sharedLifeAnniversaryYearly'),
    sharedLifeAnniversaryFormError: $('#sharedLifeAnniversaryFormError'),
    sharedLifeAnniversarySave: $('#sharedLifeAnniversarySave'),
    sharedLifeAnniversaryCancel: $('#sharedLifeAnniversaryCancel'),
    sharedLifeAnniversaryCount: $('#sharedLifeAnniversaryCount'),
    sharedLifeAnniversaryRefresh: $('#sharedLifeAnniversaryRefresh'),
    sharedLifeAnniversaryLoading: $('#sharedLifeAnniversaryLoading'),
    sharedLifeAnniversaryError: $('#sharedLifeAnniversaryError'),
    sharedLifeAnniversaryErrorText: $('#sharedLifeAnniversaryErrorText'),
    sharedLifeAnniversaryRetry: $('#sharedLifeAnniversaryRetry'),
    sharedLifeAnniversaryEmpty: $('#sharedLifeAnniversaryEmpty'),
    sharedLifeAnniversaryEmptyAdd: $('#sharedLifeAnniversaryEmptyAdd'),
    sharedLifeAnniversaryList: $('#sharedLifeAnniversaryList'),
    sharedLifeAgreementAdd: $('#sharedLifeAgreementAdd'),
    sharedLifeAgreementForm: $('#sharedLifeAgreementForm'),
    sharedLifeAgreementFormTitle: $('#sharedLifeAgreementFormTitle'),
    sharedLifeAgreementEditorClose: $('#sharedLifeAgreementEditorClose'),
    sharedLifeAgreementTitleInput: $('#sharedLifeAgreementTitleInput'),
    sharedLifeAgreementDetails: $('#sharedLifeAgreementDetails'),
    sharedLifeAgreementDueAt: $('#sharedLifeAgreementDueAt'),
    sharedLifeAgreementFormHint: $('#sharedLifeAgreementFormHint'),
    sharedLifeAgreementFormError: $('#sharedLifeAgreementFormError'),
    sharedLifeAgreementSave: $('#sharedLifeAgreementSave'),
    sharedLifeAgreementCancel: $('#sharedLifeAgreementCancel'),
    sharedLifeAgreementCount: $('#sharedLifeAgreementCount'),
    sharedLifeAgreementRefresh: $('#sharedLifeAgreementRefresh'),
    sharedLifeAgreementLoading: $('#sharedLifeAgreementLoading'),
    sharedLifeAgreementError: $('#sharedLifeAgreementError'),
    sharedLifeAgreementErrorText: $('#sharedLifeAgreementErrorText'),
    sharedLifeAgreementRetry: $('#sharedLifeAgreementRetry'),
    sharedLifeAgreementEmpty: $('#sharedLifeAgreementEmpty'),
    sharedLifeAgreementEmptyAdd: $('#sharedLifeAgreementEmptyAdd'),
    sharedLifeAgreementList: $('#sharedLifeAgreementList'),
    sharedLifeDiaryForm: $('#sharedLifeDiaryForm'),
    sharedLifeDiaryDay: $('#sharedLifeDiaryDay'),
    sharedLifeDiaryGenerate: $('#sharedLifeDiaryGenerate'),
    sharedLifeDiaryFormError: $('#sharedLifeDiaryFormError'),
    sharedLifeDiaryCount: $('#sharedLifeDiaryCount'),
    sharedLifeDiaryRefresh: $('#sharedLifeDiaryRefresh'),
    sharedLifeDiaryLoading: $('#sharedLifeDiaryLoading'),
    sharedLifeDiaryError: $('#sharedLifeDiaryError'),
    sharedLifeDiaryErrorText: $('#sharedLifeDiaryErrorText'),
    sharedLifeDiaryRetry: $('#sharedLifeDiaryRetry'),
    sharedLifeDiaryEmpty: $('#sharedLifeDiaryEmpty'),
    sharedLifeDiaryEmptyGenerate: $('#sharedLifeDiaryEmptyGenerate'),
    sharedLifeDiaryList: $('#sharedLifeDiaryList'),

    avatarMask: $('#avatarMask'),
    avatarClose: $('#avatarClose'),
    avatarStage: $('#avatarStage'),
    avatarCropImg: $('#avatarCropImg'),
    avatarZoom: $('#avatarZoom'),
    avatarRepick: $('#avatarRepick'),
    avatarCancel: $('#avatarCancel'),
    avatarConfirm: $('#avatarConfirm'),
    avatarFileInput: $('#avatarFileInput'),

    // ---- 群聊 ----
    chatMain: $('#chatMain'),
    chatAvatar: $('#chatAvatar'),
    btnGroupSet: $('#btnGroupSet'),
    btnGroupAt: $('#btnGroupAt'),
    groupSide: $('#groupSide'),
    gsAvatar: $('#gsAvatar'),
    gsName: $('#gsName'),
    gsCount: $('#gsCount'),
    gsClose: $('#gsClose'),
    gsRequestCard: $('#gsRequestCard'),
    gsRequestCount: $('#gsRequestCount'),
    gsRequests: $('#gsRequests'),
    gsAnnounce: $('#gsAnnounce'),
    gsAnnounceEdit: $('#gsAnnounceEdit'),
    gsMemberCount: $('#gsMemberCount'),
    gsInvite: $('#gsInvite'),
    gsMemberSearch: $('#gsMemberSearch'),
    gsMembers: $('#gsMembers'),
    memberMenu: $('#memberMenu'),
    mactAdminText: $('#mactAdminText'),
    mactKickText: $('#mactKickText'),
    mactPrivateShare: $('#mactPrivateShare'),
    mactPrivateShareText: $('#mactPrivateShareText'),
    createGroupMask: $('#createGroupMask'),
    cgName: $('#cgName'),
    cgMembers: $('#cgMembers'),
    cgCancel: $('#cgCancel'),
    cgCreate: $('#cgCreate'),
    cgClose: $('#cgClose'),
    inviteMask: $('#inviteMask'),
    inviteMembers: $('#inviteMembers'),
    inviteDone: $('#inviteDone'),
    inviteClose: $('#inviteClose'),
    groupSetMask: $('#groupSetMask'),
    gsSetName: $('#gsSetName'),
    gsSetSaveName: $('#gsSetSaveName'),
    gsSetMute: $('#gsSetMute'),
    gsSetSearch: $('#gsSetSearch'),
    gsSetAvatar: $('#gsSetAvatar'),
    gsSetAvatarPreview: $('#gsSetAvatarPreview'),
    gsLimits: $('#gsLimits'),
    gsSetGid: $('#gsSetGid'),
    gsSetClose: $('#gsSetClose'),
    announceMask: $('#announceMask'),
    announceInput: $('#announceInput'),
    announceCancel: $('#announceCancel'),
    announceSave: $('#announceSave'),
    announceClose: $('#announceClose'),
    groupAvatarInput: $('#groupAvatarInput'),
    gsFileTabs: $('#gsFileTabs'),
    gsFiles: $('#gsFiles'),
    gsUpload: $('#gsUpload'),
    gsFileCount: $('#gsFileCount'),
    gsFileInput: $('#gsFileInput'),
    quoteBar: $('#quoteBar'),
    qbName: $('#qbName'),
    qbText: $('#qbText'),
    qbClose: $('#qbClose'),
  };

  // 消息窗口参数：DOM 渲染窗口、翻页步长、内存软上限。
  // 24h 长跑的项目，消息只增不减 + 全量重画几周后必卡（实测切会话明显变慢）。
  const RENDER_WINDOW = 150;   // 切会话/首屏只渲染最近这么多条
  const HISTORY_PAGE = 80;     // 「加载更早」每次向服务端翻这么多
  const SEARCH_PAGE = 50;      // 完整历史搜索每页结果数
  const MEM_KEEP = 600;        // 内存里每会话最多留这么多，裁掉的可再翻页拉回

  const state = {
    ws: null,
    wsGeneration: 0,
    connected: false,
    everConnected: false,
    connecting: false,
    // 桌面/安卓注入的当前令牌优先于浏览器旧缓存，避免升级后反复要求重输。
    token: new URLSearchParams(location.search).get('access_token') ||
           localStorage.getItem(LS_TOKEN) || '',
    me: { id: 0, name: '我' },
    bot: { id: 0, name: '星野' },
    presence: null,
    characters: [],
    charMsgs: {},
    convMeta: {},
    convPrefs: readLocalMap(LS_CONV_PREFS),
    drafts: readLocalMap(LS_CONV_DRAFTS),
    draftKey: '',
    loaded: {},
    msgs: [],
    byMid: new Map(),
    // 渲染窗口：DOM 只画最近 RENDER_WINDOW 条，更早的靠顶部「加载更早」翻页
    // （先吃内存里已合并的，吃完了再向服务端按 before_id 翻）。winStart 按
    // 会话键记，切会话时贴底重置 —— 不切的话窗口随新消息无限向下长。
    winStart: {},
    hasMore: {},          // 会话键 -> 服务端明确返回的 has_more
    historyCursor: {},    // 会话键 -> 服务端返回的 next_before_id
    historyError: {},
    historyLoading: {},
    replyTerminal: new Map(),
    keySeq: 0,
    ready: false,
    liveBuffer: [],
    lastTs: 0,
    unread: 0,
    atBottom: true,
    reconnectTimer: 0,
    reconnectDelay: 1000,
    lastFrame: 0,
    pending: new Map(),
    textSendPending: new Set(),
    echoSeq: 0,
    emojiCat: 0,
    stickers: null,
    stickerGroupKey: null,
    stickerQuery: '',
    stickerManage: false,
    stickerSets: {},
    stickerSetsLoaded: false,
    recentStickers: readLocalArray(LS_RECENT_STICKERS),
    avatars: {},
    moods: {},              // 角色 id -> 一眼情绪（晴/阴/雨 + 一句人话）
    bond: null,             // 情侣 / 专属关系（全局唯一）
    bondCandidates: [],     // 每个角色的绑定资格
    profileId: '',          // 当前打开资料卡的角色 id
    profileLife: {
      peerId: '', requestSeq: 0, loading: false, error: '',
      anniversaries: [], agreements: [], diaries: [],
    },
    setup: null,            // 服务端初始化状态，不用 localStorage 伪造完成
    setupFlowActive: false, // 首次向导开始后，保存模型但不自动视为完成
    serviceSettingsSupported: null,
    settingsRequestSeq: 0,
    diagnosticsRequestSeq: 0,
    ttsSettings: null,      // 全局语音服务（不含明文密钥）
    voiceConfigs: {},       // 角色 id -> enabled / auto / voice_id / speed
    userVoice: {
      phase: 'idle',        // idle / starting / recording / stopping / preview / sending
      peer: '',
      recorder: null,
      stream: null,
      chunks: [],
      startedAt: 0,
      duration: 0,
      timer: 0,
      blob: null,
      objectUrl: '',
      seq: 0,
    },
    voicePlayback: {
      current: null,        // 用户语音；与角色 TTS 的 speech 状态分开
      failedKey: '',
    },
    speech: {
      current: null,        // 当前合成或播放任务
      queue: [],            // 仅当前私聊的自动朗读队列
      cache: null,          // 单条消息 Blob 缓存；Object URL 只在播放期间存在
      seq: 0,
      autoBlocked: false,
      failedKey: '',
      failureTimer: 0,
    },
    memories: {
      peerId: '',
      items: [],
      total: 0,
      nextOffset: 0,
      query: '',
      category: '',
      loading: false,
      loadingMore: false,
      error: '',
      requestSeq: 0,
      editing: null,
      busy: '',
      mutationSeq: 0,
    },
    sharedLife: {
      peerId: '',
      tab: 'anniversaries',
      anniversaries: [],
      agreements: [],
      diaries: [],
      loading: false,
      error: '',
      requestSeq: 0,
      mutationSeq: 0,
      busy: '',
      editingAnniversary: null,
      editingAgreement: null,
      diaryDay: '',
    },
    avatarCrop: null,
    pendingCharacterAvatar: '',
    characterDraft: null,
    characterDraftDirty: false,
    characterBusy: '',
    characterTrial: [],
    characterRequestSeq: 0,
    personaEditor: {
      peerId: '', revision: '', versions: [], requestSeq: 0,
      busy: false, dirty: false,
    },
    chatThemes: {},
    chatSide: 'in',
    chatBackgroundUrl: '',
    chatBackgroundSeq: 0,
    chatBackgroundBusy: false,
    mobileTab: 'messages',
    ctxMsg: null,
    convMenuFor: null,
    convActionsFor: null,
    selectMode: false,
    selected: new Set(),
    marquee: null,
    suppressClickUntil: 0,
    forwardMode: '',
    lastRead: (() => {
      try { return JSON.parse(localStorage.getItem('vol.lastRead') || '{}'); }
      catch (e) { return {}; }
    })(),
    lastReadSent: {},
    historySearch: {
      key: '', query: '', items: [], seen: new Set(), searched: false,
      hasMore: false, nextBeforeId: '',
      loading: false, loadingMore: false, error: '',
      requestSeq: 0, controller: null,
      locatingMid: '', locateSeq: 0, locateError: '',
    },
    globalSearch: {
      query: '', items: [], loading: false, searched: false, error: '',
      requestSeq: 0, controller: null, locateSeq: 0,
    },
    desktopView: 'messages',
    dragDepth: 0,
    notifications: localStorage.getItem(LS_NOTIFICATIONS) === '1',
    notificationPermissionBusy: false,

    // ---- 群聊 ----
    // 当前会话身份：private（私聊某个角色）/ group（某个自建群）。
    // 「会话键」统一成字符串：私聊 = 角色 id，群聊 = "g"+群号 —— 两套
    // id 空间互不重叠，convMeta / 已读 / 聊天气泡主题都能按同一个键索引。
    peer: { type: 'private', id: 0, name: '星野' },
    groups: [],                 // 群概览列表（/api/groups）
    groupMsgs: {},              // gid(str) -> 消息数组（非当前会话的缓存）
    groupDetail: {},            // gid(str) -> 完整详情（成员/公告/禁言）
    groupMenuFor: '',           // 成员行操作菜单当前指向的成员 id
    memberMenuFor: null,        // 成员行操作菜单当前指向的成员对象
    joinRequests: [],           // 待审的入群申请（全局，群行红点用）
    pendingMentions: [],        // 本次输入里 @ 了谁（发送时转成 at 段）
    replyTo: null,              // 正在引用回复的消息（群里用）
    groupFiles: {},             // gid(str) -> 群文件列表
    groupFileTab: 'file',       // 群文件面板的页签：file / album
    avatarTarget: null,        // 当前裁剪的是谁的头像（peer / group）
  };

  const nowSec = () => Math.floor(Date.now() / 1000);

  // ---------------------------------------------------------- 会话键
  // 私聊键 = String(角色 id)；群聊键 = "g" + 群号。所有按会话索引的表
  // （convMeta / lastRead / 气泡主题 / 消息缓存）都用同一个键。
  const isGroup = () => state.peer.type === 'group';
  const groupKey = (gid) => 'g' + String(gid);
  function curConvKey() {
    return isGroup() ? groupKey(state.peer.id) : String(state.bot.id);
  }
  // 气泡主题也按会话键索引（私聊按角色；群里共用一套默认主题）
  const themeKey = () => curConvKey();
  // 取某个会话的消息数组（当前会话 = state.msgs），必要时惰性创建
  function listFor(key) {
    const k = String(key);
    if (k === curConvKey()) return state.msgs;
    if (k.charAt(0) === 'g') {
      const gid = k.slice(1);
      return state.groupMsgs[gid] || (state.groupMsgs[gid] = []);
    }
    return state.charMsgs[k] || (state.charMsgs[k] = []);
  }
  function groupById(gid) {
    const g = String(gid);
    return state.groups.find((x) => String(x.group_id) === g) || null;
  }
  function groupKnown(gid) {
    const g = String(gid);
    return !!groupById(g) || !!state.groupDetail[g];
  }
  // 群头像：优先用自建群上传的头像（/api/avatars 里键是 "g"+群号），
  // 否则退回首字文字头像（群里没有 QQ 号可用），保持和好友头像同一尺寸。
  function fillGroupAvatar(el, name, gid) {
    if (!el) return;
    const key = 'g' + String(gid);
    el.textContent = '';
    el.classList.remove('has-img');
    const span = document.createElement('span');
    span.textContent = firstChar(name || '群');
    el.appendChild(span);
    const custom = state.avatars[key];
    if (!custom) return;
    const img = document.createElement('img');
    img.alt = name || '群';
    img.loading = 'lazy';
    img.decoding = 'async';
    img.referrerPolicy = 'no-referrer';
    img.addEventListener('load', () => el.classList.add('has-img'));
    img.addEventListener('error', () => img.remove());
    img.src = resolveAsset(custom);
    el.appendChild(img);
  }
  function groupName(gid) {
    const d = state.groupDetail[String(gid)];
    if (d && d.group_name) return d.group_name;
    const g = groupById(gid);
    return (g && g.group_name) || '群聊';
  }
  // 当前会话的显示名（群名 / 角色名）
  function curPeerName() {
    return isGroup() ? groupName(state.peer.id) : state.bot.name;
  }
  function isOwner(uid) {
    return String(uid || '') === String(state.me.id || '');
  }
  // 消息发送者（群消息用；私聊回落到当前角色）
  function senderOf(ev) {
    const s = ev.sender || {};
    return {
      id: String(s.user_id || ev.user_id || ''),
      name: String(s.nickname || s.card || '').trim() || '成员',
      role: String(s.role || 'member'),
      title: String(s.title || ''),
      level: Number(s.level || 1),
    };
  }

  const fmtClock = (ts) => {
    const d = new Date(ts * 1000);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  const fmtConvTime = (ts) => {
    if (!ts) return '';
    const d = new Date(ts * 1000);
    const now = new Date();
    const sameDay = d.toDateString() === now.toDateString();
    if (sameDay) return fmtClock(ts);
    const y = new Date(now);
    y.setDate(now.getDate() - 1);
    if (d.toDateString() === y.toDateString()) return '昨天';
    const days = Math.floor((now - d) / 86400000);
    if (days < 7) return '周' + '日一二三四五六'[d.getDay()];
    return `${d.getMonth() + 1}/${d.getDate()}`;
  };

  const fmtSep = (ts) => {
    const d = new Date(ts * 1000);
    const now = new Date();
    const sameDay = d.toDateString() === now.toDateString();
    if (sameDay) return `今天 ${fmtClock(ts)}`;
    const y = new Date(now);
    y.setDate(now.getDate() - 1);
    if (d.toDateString() === y.toDateString()) return `昨天 ${fmtClock(ts)}`;
    if (d.getFullYear() === now.getFullYear()) {
      return `${d.getMonth() + 1}月${d.getDate()}日 ${fmtClock(ts)}`;
    }
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日 ${fmtClock(ts)}`;
  };

  const firstChar = (name) => (String(name || '').trim().slice(0, 1) || '星');

  // QQ 头像（和 Stapxs 用的是同一个公开接口）；加载失败就保留文字头像
  const qqAvatarUrl = (uin, size = 160) =>
    uin ? `https://q1.qlogo.cn/g?b=qq&s=${size}&nk=${uin}` : '';

  // 用户在「聊天设置 → 更换头像」里裁剪上传的自定义头像
  function customAvatarUrl(uin) {
    const key = String(uin || '');
    return key ? (state.avatars[key] || '') : '';
  }

  function fillAvatar(el, name, uin, fallback) {
    if (!el) return;
    // 在线状态点是 railAvatar 的常驻子元素，不能被重画头像清掉
    const dot = el.querySelector('.presence-dot');
    el.textContent = '';
    el.classList.remove('has-img');
    const span = document.createElement('span');
    span.textContent = fallback || firstChar(name);
    el.appendChild(span);
    const keepDot = () => { if (dot && !el.contains(dot)) el.appendChild(dot); };
    if (!uin) { keepDot(); return; }

    const attach = (src, onFail) => {
      const img = document.createElement('img');
      img.alt = name || '';
      img.loading = 'lazy';
      img.decoding = 'async';
      img.referrerPolicy = 'no-referrer';
      img.addEventListener('load', () => el.classList.add('has-img'));
      img.addEventListener('error', () => {
        img.remove();
        if (onFail) onFail();
      });
      img.src = src;
      el.appendChild(img);
    };

    const custom = customAvatarUrl(uin);
    if (custom) {
      // 自定义头像读不到时退回 QQ 头像，不留空白
      attach(resolveAsset(custom), () => {
        const qq = qqAvatarUrl(uin);
        if (qq) attach(qq);
      });
    } else {
      attach(qqAvatarUrl(uin));
    }
    keepDot();
  }

  // 头像换好后，把当前会话里的「角色头像」重画。
  // ★ 群聊里每条消息的发送者各不相同 —— 拿 state.bot 去重画会把所有群成员
  //   都画成同一个头像（实测 bug），所以群里直接按消息重建整屏。
  function refreshBotAvatars() {
    // ★ 群模式放在 state.bot.id 检查之前：群聊里 state.bot 可能还没/已经
    //   指向别的私聊角色，用它当闸门会把「刷新进页面时群头像没加载出来」
    //   这个 bug 重新引回来（群渲染本就不依赖 state.bot）。
    if (isGroup()) {
      // ★ 群模式下：整屏消息要重画，右侧面板 + 聊天头部的群头像也要重画。
      //   只调 renderAll 的话，刷新进页面时 chatAvatar 会停在文字兜底上，
      //   必须等切走再切回来才变正常（实测 bug）—— 因为 state.avatars 是
      //   异步才加载好的，而这里没通知头部。
      renderAll(false);
      renderGroupSide();
      renderConvList();
      renderContactList();
      return;
    }
    if (!state.bot.id) return;
    document.querySelectorAll('#msgList .msg-row.in .avatar.bot-avatar')
      .forEach((el) => {
        fillAvatar(el, state.bot.name, state.bot.id);
      });
    fillAvatar(els.emptyAvatar, state.bot.name, state.bot.id);
    applyChatSettingsIdentity();
    renderConvList();
    renderContactList();
  }

  async function loadAvatars() {
    try {
      const res = await apiFetch('/api/avatars', { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      state.avatars = (data && typeof data.items === 'object') ? data.items : {};
      fillAvatar(els.brandAvatar, state.me.name, state.me.id, '我');
      fillAvatar(els.railAvatar, state.me.name, state.me.id, '我');
      fillAvatar(els.mobileAvatar, state.me.name, state.me.id, '我');
      fillAvatar(els.csPreviewOutAvatar, state.me.name, state.me.id, '我');
      document.querySelectorAll('#msgList .msg-row.out .me-avatar').forEach((el) => {
        fillAvatar(el, state.me.name, state.me.id, '我');
      });
      refreshBotAvatars();
      renderConvList();
      renderContactList();
      applyFavicon();
    } catch (e) { /* 老服务端没有这个接口时静默 */ }
  }

  function applyFavicon() {
    const link = document.getElementById('favicon');
    if (!link || !state.bot.id) return;
    const custom = customAvatarUrl(state.bot.id);
    if (custom) {
      link.href = resolveAsset(custom);
      return;
    }
    const icon = new Image();
    icon.referrerPolicy = 'no-referrer';
    icon.onload = () => { link.href = icon.src; };
    icon.src = qqAvatarUrl(state.bot.id, 100);
  }

  const toastTimer = { id: 0, hideId: 0 };
  function toast(text) {
    clearTimeout(toastTimer.id);
    clearTimeout(toastTimer.hideId);
    els.toast.textContent = text;
    els.toast.classList.remove('hidden');
    requestAnimationFrame(() => els.toast.classList.add('show'));
    toastTimer.id = setTimeout(() => {
      els.toast.classList.remove('show');
      toastTimer.hideId = setTimeout(() => els.toast.classList.add('hidden'), 220);
    }, 2200);
  }

  function copyText(text) {
    const s = String(text || '');
    if (!s) return;
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(s).then(() => toast('已复制'), () => fallbackCopy(s));
    } else {
      fallbackCopy(s);
    }
  }
  function fallbackCopy(s) {
    const ta = document.createElement('textarea');
    ta.value = s;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); toast('已复制'); }
    catch (e) { toast('复制失败'); }
    ta.remove();
  }

  // ---------------------------------------------------------- 主题
  function setTheme(theme, save = true) {
    document.documentElement.dataset.theme = theme === 'dark' ? 'dark' : 'light';
    if (save) localStorage.setItem(LS_THEME, theme);
    document.querySelectorAll('#themeSeg button').forEach((b) => {
      b.classList.toggle('active', b.dataset.theme === theme);
    });
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = theme === 'dark' ? '#0c0e17' : '#e9e9f2';
  }
  // 消息显示和发送方式属于本机偏好，不写入服务端公共配置。
  const APPEARANCE_DEFAULTS = { density: 'comfortable', fontSize: 'standard', sendKey: 'enter' };
  const APPEARANCE_OPTIONS = {
    density: ['comfortable', 'compact'],
    fontSize: ['standard', 'large', 'xlarge'],
    sendKey: ['enter', 'ctrl-enter'],
  };
  let appearancePrefs = { ...APPEARANCE_DEFAULTS };

  function sanitizeAppearance(raw) {
    const out = { ...APPEARANCE_DEFAULTS };
    for (const [key, choices] of Object.entries(APPEARANCE_OPTIONS)) {
      if (raw && choices.includes(raw[key])) out[key] = raw[key];
    }
    return out;
  }

  function applyAppearance(save = true) {
    document.documentElement.dataset.density = appearancePrefs.density;
    document.documentElement.dataset.fontSize = appearancePrefs.fontSize;
    els.settingsDensity.value = appearancePrefs.density;
    els.settingsFontSize.value = appearancePrefs.fontSize;
    els.settingsSendKey.value = appearancePrefs.sendKey;
    const ctrlSend = appearancePrefs.sendKey === 'ctrl-enter';
    $('.send-hint').textContent = ctrlSend
      ? 'Ctrl + Enter 发送 · Shift + Enter 换行'
      : 'Enter 发送 · Shift + Enter 换行';
    els.input.setAttribute('aria-keyshortcuts', ctrlSend ? 'Control+Enter' : 'Enter');
    if (save) {
      try { localStorage.setItem(LS_APPEARANCE, JSON.stringify(appearancePrefs)); }
      catch (e) { toast('聊天显示偏好暂时无法保存'); }
    }
  }

  for (const [key, id] of [['density', 'settingsDensity'], ['fontSize', 'settingsFontSize'], ['sendKey', 'settingsSendKey']]) {
    document.getElementById(id).addEventListener('change', (event) => {
      appearancePrefs = sanitizeAppearance({ ...appearancePrefs, [key]: event.target.value });
      applyAppearance();
    });
  }

  function immersionEnabled() {
    return document.documentElement.dataset.immersive === '1';
  }

  function setImmersion(enabled, save = true) {
    const on = !!enabled;
    document.documentElement.dataset.immersive = on ? '1' : '0';
    els.settingsImmersion.checked = on;
    if (save) {
      try { localStorage.setItem(LS_IMMERSION, on ? '1' : '0'); }
      catch (e) { toast('沉浸偏好暂时无法保存'); }
    }
    if (state.ready) applyPeerIdentity();
  }

  els.railTheme.addEventListener('click', () => {
    setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
  });
  els.themeSeg.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-theme]');
    if (b) setTheme(b.dataset.theme);
  });
  els.settingsImmersion.addEventListener('change', () => {
    setImmersion(els.settingsImmersion.checked);
  });

  // ---------------------------------------------------------- 聊天气泡（按对话保存）
  const LS_CHAT_THEME = 'vol.chatTheme';
  const BUBBLE_STYLES = [
    { id: 'classic', name: '经典' },
    { id: 'tail', name: '尖角' },
    { id: 'glass', name: '玻璃' },
    { id: 'cream', name: '奶油' },
    { id: 'line', name: '线框' },
    { id: 'neon', name: '霓虹' },
    { id: 'lace', name: '花边' },
    { id: 'cloud', name: '云朵' },
  ];
  const DEFAULT_IN = {
    style: 'classic', custom: false,
    bg1: '#ffffff', bg2: '#f8f7fd', fg: '#292735',
    tag: '', deco: 'none',
  };
  const DEFAULT_OUT = {
    style: 'classic', custom: false,
    bg1: '#877aef', bg2: '#6d5fd7', fg: '#ffffff',
    tag: '', deco: 'none',
  };
  const TAG_PRESETS = ['', 'MUM', '♡', '(๑•̀ㅂ•́)و✧', '喵', '星野', '大叔'];
  const DECO_PRESETS = [
    { v: 'none', label: '无' },
    { v: '✦', label: '✦' },
    { v: '♡', label: '♡' },
    { v: '✧', label: '✧' },
    { v: '🎀', label: '🎀' },
    { v: '⭐', label: '⭐' },
    { v: '(๑>ᴗ<๑)', label: '(๑>ᴗ<๑)' },
  ];
  const COLOR_RE = /^#[0-9a-f]{6}$/i;
  const CHAT_BG_PRESETS = [
    { id: 'default', name: '默认' },
    { id: 'mist', name: '雾紫' },
    { id: 'starlight', name: '星夜' },
    { id: 'sakura', name: '樱花' },
    { id: 'seaside', name: '海盐' },
    { id: 'forest', name: '森系' },
  ];
  const DEFAULT_CHAT_BG = { preset: 'default', imageId: '' };

  function sanitizeChatBackground(raw) {
    const out = { ...DEFAULT_CHAT_BG };
    if (!raw || typeof raw !== 'object') return out;
    if (CHAT_BG_PRESETS.some((x) => x.id === raw.preset) || raw.preset === 'custom') {
      out.preset = raw.preset;
    }
    if (typeof raw.imageId === 'string' && /^[a-z0-9:_.-]{1,160}$/i.test(raw.imageId)) {
      out.imageId = raw.imageId;
    }
    if (out.preset === 'custom' && !out.imageId) out.preset = 'default';
    return out;
  }

  function sanitizeSide(raw, base) {
    const out = { ...base };
    if (!raw || typeof raw !== 'object') return out;
    if (BUBBLE_STYLES.some((s) => s.id === raw.style)) out.style = raw.style;
    out.custom = !!raw.custom;
    for (const k of ['bg1', 'bg2', 'fg']) {
      if (typeof raw[k] === 'string' && COLOR_RE.test(raw[k])) out[k] = raw[k];
    }
    out.tag = typeof raw.tag === 'string' ? raw.tag.slice(0, 12) : '';
    out.deco = typeof raw.deco === 'string' ? raw.deco.slice(0, 16) : 'none';
    return out;
  }

  function loadChatThemes() {
    try {
      const raw = JSON.parse(localStorage.getItem(LS_CHAT_THEME) || '{}');
      const out = {};
      for (const [peer, v] of Object.entries(raw || {})) {
        if (!v || typeof v !== 'object') continue;
        out[peer] = {
          in: sanitizeSide(v.in, DEFAULT_IN),
          out: sanitizeSide(v.out, DEFAULT_OUT),
          background: sanitizeChatBackground(v.background),
        };
      }
      return out;
    } catch (e) {
      return {};
    }
  }
  state.chatThemes = loadChatThemes();

  function ensureChatTheme(peerId) {
    const key = String(peerId || '0');
    if (!state.chatThemes[key]) {
      state.chatThemes[key] = {
        in: { ...DEFAULT_IN }, out: { ...DEFAULT_OUT },
        background: { ...DEFAULT_CHAT_BG },
      };
    }
    if (!state.chatThemes[key].background) {
      state.chatThemes[key].background = { ...DEFAULT_CHAT_BG };
    }
    return state.chatThemes[key];
  }

  function chatThemeFor(peerId, side) {
    const t = ensureChatTheme(peerId);
    return side === 'out' ? t.out : t.in;
  }

  function editTheme() {
    return chatThemeFor(themeKey(), state.chatSide);
  }

  function saveChatThemes() {
    try {
      localStorage.setItem(LS_CHAT_THEME, JSON.stringify(state.chatThemes));
      return true;
    } catch (e) {
      toast('外观保存失败：浏览器存储不可用或空间不足');
      return false;
    }
  }

  // 大尺寸聊天背景存 IndexedDB；localStorage 只保留很小的外观元数据。
  let chatBgDbPromise = null;
  function openChatBgDb() {
    if (!window.indexedDB) return Promise.reject(new Error('此浏览器不支持本地图片存储'));
    if (chatBgDbPromise) return chatBgDbPromise;
    chatBgDbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open('vol-chat-appearance', 1);
      req.onupgradeneeded = () => {
        if (!req.result.objectStoreNames.contains('backgrounds')) {
          req.result.createObjectStore('backgrounds', { keyPath: 'id' });
        }
      };
      req.onsuccess = () => {
        req.result.onversionchange = () => req.result.close();
        resolve(req.result);
      };
      req.onerror = () => reject(req.error || new Error('无法打开背景存储'));
      req.onblocked = () => reject(new Error('背景存储正被另一个页面占用'));
    });
    chatBgDbPromise.catch(() => { chatBgDbPromise = null; });
    return chatBgDbPromise;
  }

  async function chatBgOperation(mode, operation) {
    const db = await openChatBgDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('backgrounds', mode);
      const req = operation(tx.objectStore('backgrounds'));
      let result;
      req.onsuccess = () => { result = req.result; };
      req.onerror = () => reject(req.error || new Error('背景存储操作失败'));
      tx.oncomplete = () => resolve(result);
      tx.onerror = () => reject(tx.error || new Error('背景存储事务失败'));
      tx.onabort = () => reject(tx.error || new Error('背景存储事务已取消'));
    });
  }

  const getChatBgRecord = (id) => chatBgOperation('readonly', (store) => store.get(id));
  const putChatBgRecord = (record) => chatBgOperation('readwrite', (store) => store.put(record));
  const deleteChatBgRecord = (id) => chatBgOperation('readwrite', (store) => store.delete(id));

  function setSideColorVars(side, t) {
    const root = document.documentElement;
    const cap = side === 'out' ? 'Out' : 'In';
    const pre = side === 'out' ? '--custom-out' : '--custom-in';
    root.dataset['custom' + cap] = t.custom ? '1' : '0';
    if (t.custom) {
      root.style.setProperty(pre + '-bg1', t.bg1);
      root.style.setProperty(pre + '-bg2', t.bg2);
      root.style.setProperty(pre + '-fg', t.fg);
    } else {
      for (const k of ['bg1', 'bg2', 'fg']) root.style.removeProperty(pre + '-' + k);
    }
  }

  function applyChatColors() {
    setSideColorVars('in', chatThemeFor(themeKey(), 'in'));
    setSideColorVars('out', chatThemeFor(themeKey(), 'out'));
  }

  function applyBubbleDecor(bubble, theme) {
    if (!bubble) return;
    bubble.querySelectorAll('.bubble-tag,.bubble-deco').forEach((n) => n.remove());
    if (bubble.classList.contains('sticker') || bubble.classList.contains('media')) return;
    if (theme.deco && theme.deco !== 'none') {
      const d = document.createElement('span');
      d.className = 'bubble-deco';
      d.textContent = theme.deco;
      bubble.appendChild(d);
    }
    if (theme.tag) {
      const t = document.createElement('span');
      t.className = 'bubble-tag';
      t.textContent = theme.tag;
      bubble.appendChild(t);
    }
  }

  function renderChatPreview() {
    const pairs = [[els.csPreviewIn, 'in'], [els.csPreviewOut, 'out']];
    for (const [row, side] of pairs) {
      if (!row) continue;
      const bubble = row.querySelector('.bubble');
      if (!bubble) continue;
      applyBubbleDecor(bubble, chatThemeFor(themeKey(), side));
      row.classList.toggle('has-tag', !!bubble.querySelector('.bubble-tag'));
    }
  }

  function refreshBubbleDecorAll() {
    if (els.msgList) {
      els.msgList.querySelectorAll('.msg-row').forEach((row) => {
        if (row.closest('.cs-preview')) return;
        const bubble = row.querySelector('.bubble');
        if (!bubble) return;
        const dir = row.classList.contains('out') ? 'out' : 'in';
        applyBubbleDecor(bubble, chatThemeFor(themeKey(), dir));
        row.classList.toggle('has-tag', !!bubble.querySelector('.bubble-tag'));
      });
    }
    renderChatPreview();
  }

  function chatBackgroundFor(peerId) {
    return ensureChatTheme(peerId).background;
  }

  function clearChatBackgroundUrl() {
    if (state.chatBackgroundUrl) URL.revokeObjectURL(state.chatBackgroundUrl);
    state.chatBackgroundUrl = '';
    document.documentElement.style.removeProperty('--chat-custom-image');
  }

  function renderChatBackgroundSettings() {
    if (!els.csChatBgPresets) return;
    const bg = chatBackgroundFor(themeKey());
    const options = bg.imageId
      ? [...CHAT_BG_PRESETS, { id: 'custom', name: '我的图片' }]
      : CHAT_BG_PRESETS;
    els.csChatBgPresets.innerHTML = '';
    for (const item of options) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'chat-bg-opt' + (bg.preset === item.id ? ' active' : '');
      b.dataset.bg = item.id;
      b.setAttribute('aria-pressed', bg.preset === item.id ? 'true' : 'false');
      const swatch = document.createElement('span');
      swatch.className = 'chat-bg-swatch';
      swatch.dataset.bgPreview = item.id;
      swatch.setAttribute('aria-hidden', 'true');
      if (item.id === 'custom' && state.chatBackgroundUrl) {
        swatch.style.backgroundImage = `url("${state.chatBackgroundUrl}")`;
      }
      const label = document.createElement('span');
      label.textContent = item.name;
      b.append(swatch, label);
      b.addEventListener('click', () => selectChatBackground(item.id));
      els.csChatBgPresets.appendChild(b);
    }
    const current = options.find((x) => x.id === bg.preset) || CHAT_BG_PRESETS[0];
    els.csChatBgStatus.textContent = bg.preset === 'custom'
      ? '正在使用自定义图片。图片不会上传，只保存在此浏览器。'
      : (bg.imageId
        ? `当前：${current.name}。已保留“我的图片”，可随时切回。`
        : `当前：${current.name}。背景与气泡按角色分别保存，仅在此浏览器生效。`);
    els.csChatBgReset.disabled = bg.preset === 'default' && !bg.imageId;
    els.csChatBgPick.classList.toggle('disabled', state.chatBackgroundBusy);
    els.csChatBgPick.setAttribute('aria-disabled', state.chatBackgroundBusy ? 'true' : 'false');
    els.csChatBgInput.disabled = state.chatBackgroundBusy;
  }

  async function applyChatBackground() {
    const key = themeKey();
    const bg = { ...chatBackgroundFor(key) };
    const seq = ++state.chatBackgroundSeq;
    const root = document.documentElement;
    clearChatBackgroundUrl();
    root.dataset.chatBg = bg.preset;
    if (bg.preset !== 'custom' || !bg.imageId) return;
    try {
      const record = await getChatBgRecord(bg.imageId);
      if (seq !== state.chatBackgroundSeq || themeKey() !== key) return;
      if (!record || !record.blob) {
        const current = chatBackgroundFor(key);
        if (current.imageId === bg.imageId) {
          current.preset = 'default';
          current.imageId = '';
          saveChatThemes();
        }
        root.dataset.chatBg = 'default';
        if (!els.chatSettingsMask.classList.contains('hidden')) {
          renderChatBackgroundSettings();
          els.csChatBgStatus.textContent = '这张本地图片已不存在，请重新上传。';
        }
        return;
      }
      const url = URL.createObjectURL(record.blob);
      if (seq !== state.chatBackgroundSeq || themeKey() !== key) {
        URL.revokeObjectURL(url);
        return;
      }
      state.chatBackgroundUrl = url;
      root.style.setProperty('--chat-custom-image', `url("${url}")`);
      if (!els.chatSettingsMask.classList.contains('hidden')) {
        renderChatBackgroundSettings();
      }
    } catch (e) {
      if (seq !== state.chatBackgroundSeq || themeKey() !== key) return;
      root.dataset.chatBg = 'default';
      if (!els.chatSettingsMask.classList.contains('hidden')) {
        renderChatBackgroundSettings();
        els.csChatBgStatus.textContent = '背景读取失败，已暂时使用默认背景。';
      }
    }
  }

  function selectChatBackground(preset) {
    const bg = chatBackgroundFor(themeKey());
    if (preset === 'custom' && !bg.imageId) { pickChatBackground(); return; }
    if (preset !== 'custom' && !CHAT_BG_PRESETS.some((x) => x.id === preset)) return;
    const previous = bg.preset;
    bg.preset = preset;
    if (!saveChatThemes()) { bg.preset = previous; return; }
    applyChatBackground();
    renderChatBackgroundSettings();
  }

  function pickChatBackground() {
    if (state.chatBackgroundBusy) return;
    els.csChatBgInput.value = '';
    els.csChatBgInput.click();
  }

  async function saveChatBackground(file) {
    if (!file || state.chatBackgroundBusy) return;
    if (!/^image\/(png|jpeg|webp|gif)$/i.test(file.type || '')) {
      toast('请选择 PNG、JPG、WebP 或 GIF 图片');
      return;
    }
    if (!file.size || file.size > 8 * 1024 * 1024) {
      toast(file.size ? '图片太大（上限 8MB）' : '图片内容为空');
      return;
    }
    const key = themeKey();
    const imageId = `bg-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
    state.chatBackgroundBusy = true;
    renderChatBackgroundSettings();
    try {
      await putChatBgRecord({
        id: imageId, blob: file, type: file.type,
        name: String(file.name || '').slice(0, 120), updatedAt: Date.now(),
      });
      const theme = ensureChatTheme(key);
      const previous = { ...theme.background };
      theme.background = { preset: 'custom', imageId };
      if (!saveChatThemes()) {
        theme.background = previous;
        await deleteChatBgRecord(imageId).catch(() => {});
        return;
      }
      if (previous.imageId && previous.imageId !== imageId) {
        deleteChatBgRecord(previous.imageId).catch(() => {});
      }
      if (themeKey() === key) await applyChatBackground();
      toast('聊天背景已保存，仅保留在此浏览器');
    } catch (e) {
      toast('背景保存失败：' + (e?.message || e));
    } finally {
      state.chatBackgroundBusy = false;
      els.csChatBgInput.value = '';
      if (!els.chatSettingsMask.classList.contains('hidden')) {
        renderChatBackgroundSettings();
      }
    }
  }

  function resetChatBackground() {
    const key = themeKey();
    const bg = chatBackgroundFor(key);
    const previous = { ...bg };
    bg.preset = 'default';
    bg.imageId = '';
    if (!saveChatThemes()) {
      chatBackgroundFor(key).background = previous;
      return;
    }
    if (previous.imageId) deleteChatBgRecord(previous.imageId).catch(() => {});
    if (themeKey() === key) applyChatBackground();
    renderChatBackgroundSettings();
    toast('已恢复默认聊天背景');
  }

  function applyChatTheme() {
    const ti = chatThemeFor(themeKey(), 'in');
    const to = chatThemeFor(themeKey(), 'out');
    document.documentElement.dataset.bubbleIn = ti.style;
    document.documentElement.dataset.bubbleOut = to.style;
    applyChatColors();
    refreshBubbleDecorAll();
    applyChatBackground();
  }

  // ---------------------------------------------------------- 连接
  function wsUrl() {
    const proto = location.protocol === 'https:' ? 'wss:' : 'ws:';
    const base = `${proto}//${location.host}/onebot/v11/ws`;
    return state.token ? `${base}?access_token=${encodeURIComponent(state.token)}` : base;
  }

  function onlineChatSubtitle() {
    const mood = state.bot ? moodOf(state.bot.id) : null;
    const line = mood && mood.line ? mood.line : '';
    if (immersionEnabled()) return line || '此刻，陪你慢慢聊';
    return '在线 · 本地直连' + (line ? ' · ' + line : '');
  }

  function hasReplyProcessing(key) {
    const k = String(key || '');
    if (!k || k.charAt(0) === 'g') return false;
    return listFor(k).some((m) => m.dir === 'out' && m.replyStatus === 'processing');
  }

  function connectedPrivateSubtitle() {
    return hasReplyProcessing(curConvKey()) ? '对方正在输入…' : onlineChatSubtitle();
  }

  function setConn(kind, text) {
    els.connChip.className = 'conn-chip' + (kind ? ' ' + kind : '');
    els.connChipText.textContent = text;
    els.onlineDot.className = 'online-dot' + (kind === 'ok' ? ' ok' : '');
    // 群会话的副标题由群状态（人数/禁言）决定，不被连接文案覆盖
    if (!isGroup()) {
      els.chatSub.textContent = kind === 'ok' ? connectedPrivateSubtitle() : text;
    }
    els.input.placeholder = kind === 'ok'
      ? `和${curPeerName()}说点什么…`
      : '连接断开，正在重连…';
    syncTypingIndicator();
    if (els.mobileStatus) {
      if (state.presence) {
        // 已经拿到在线状态 → 用状态标签，连接状态交给别处显示
        applyPresenceUI();
      } else {
        els.mobileStatus.textContent = kind === 'ok' ? '在线' : text;
        const line = els.mobileStatus.closest('.mh-status');
        if (line) line.classList.toggle('ok', kind === 'ok');
      }
    }
  }

  function showConnect(text, tokenVisible) {
    els.connectView.classList.remove('hidden');
    els.appView.classList.add('hidden');
    els.connectState.classList.toggle('bad', !!text);
    els.connectStateText.textContent = text || '正在连接…';
    if (tokenVisible) {
      els.tokenRow.classList.remove('hidden');
      els.tokenInput.value = state.token;
      setTimeout(() => els.tokenInput.focus(), 60);
    }
  }

  function hideConnect() {
    els.connectView.classList.add('hidden');
    els.appView.classList.remove('hidden');
  }

  function rejectAllPending(reason) {
    for (const [, p] of state.pending) {
      clearTimeout(p.timer);
      p.reject(new Error(reason));
    }
    state.pending.clear();
  }

  function call(action, params = {}, timeout = 15000) {
    return new Promise((resolve, reject) => {
      const ws = state.ws;
      if (!ws || ws.readyState !== 1) {
        reject(new Error('未连接'));
        return;
      }
      const generation = state.wsGeneration;
      const echo = `e${++state.echoSeq}_${Date.now()}`;
      const pending = { resolve, reject, timer: 0, ws, generation };
      pending.timer = setTimeout(() => {
        if (state.pending.get(echo) !== pending) return;
        state.pending.delete(echo);
        reject(new Error('请求超时'));
      }, timeout);
      state.pending.set(echo, pending);
      try {
        ws.send(JSON.stringify({ action, params, echo }));
      } catch (e) {
        clearTimeout(pending.timer);
        state.pending.delete(echo);
        reject(e);
      }
    });
  }

  function discardSocket(ws) {
    if (!ws) return;
    ws.onopen = null;
    ws.onmessage = null;
    ws.onerror = null;
    ws.onclose = null;
    try {
      if (ws.readyState === 0 || ws.readyState === 1) ws.close();
    } catch (e) { /* ignore */ }
  }

  function connect() {
    if (state.ws && (state.ws.readyState === 0 || state.ws.readyState === 1)) return;
    clearTimeout(state.reconnectTimer);
    if (location.protocol === 'file:') {
      showConnect('请先启动 星伴，再用 http://127.0.0.1:8080/ 打开本页面');
      els.connectTip.textContent = '直接双击 HTML 文件无法连接，必须通过 星伴 提供的地址访问。';
      return;
    }
    discardSocket(state.ws);
    state.ws = null;
    state.connecting = true;
    setConn('warn', '连接中…');
    if (!els.connectView.classList.contains('hidden')) {
      els.connectState.classList.remove('bad');
      els.connectStateText.textContent = '正在连接…';
    }

    const generation = ++state.wsGeneration;
    let ws;
    try {
      ws = new WebSocket(wsUrl());
    } catch (e) {
      state.connecting = false;
      scheduleReconnect();
      return;
    }
    state.ws = ws;
    const isCurrent = () => state.ws === ws && state.wsGeneration === generation;
    const handshakeCall = async (action, params = {}, timeout = 15000) => {
      if (!isCurrent()) throw new Error('连接已更换');
      const result = await call(action, params, timeout);
      if (!isCurrent()) throw new Error('连接已更换');
      return result;
    };

    ws.onopen = async () => {
      if (!isCurrent()) return;
      state.lastFrame = Date.now();
      try {
        const info = await handshakeCall('get_version_info', {});
        if (!isCurrent()) return;
        const rawVer = String(info?.data?.app_version || '');
        const mVer = rawVer.match(/\d+\.\d+(?:\.\d+)?/);
        els.verText.textContent = mVer ? 'v' + mVer[0] : 'v1.0';
      } catch (e) {
        if (!isCurrent()) return;
        // 版本信息不影响后续握手。
      }

      try {
        const login = await handshakeCall('get_login_info', {});
        if (!isCurrent()) return;
        state.me = {
          id: Number(login?.data?.user_id || 0),
          name: login?.data?.nickname || '我',
        };

        let buddies = [];
        try {
          const fr = await handshakeCall('get_friends_with_category', {});
          if (!isCurrent()) return;
          for (const cat of (fr?.data || [])) {
            buddies.push(...(cat?.buddyList || []));
          }
        } catch (e) {
          if (!isCurrent()) return;
          // 老服务端回退到普通好友列表。
        }
        if (!buddies.length) {
          const fl = await handshakeCall('get_friend_list', {});
          if (!isCurrent()) return;
          buddies = (fl?.data || []);
        }
        state.characters = buddies
          .map((b) => ({ id: Number(b.user_id || 0), name: b.nickname || '角色' }))
          .filter((c) => c.id);
        if (state.characters.length) {
          const saved = Number(localStorage.getItem('vol.currentPeer') || 0);
          state.bot = state.characters.find((c) => c.id === saved) ||
            state.characters[0];
        }
        // 会话列表的「最近一条」预览（服务端顺带返回，非标准字段）
        try {
          const rec = await handshakeCall('get_recent_contact', {}, 8000);
          if (!isCurrent()) return;
          for (const it of (rec?.data || [])) {
            const key = String(it.peerUin || '');
            if (!key) continue;
            const meta = convMetaFor(key);
            if (it.lastMsg) meta.preview = String(it.lastMsg);
            if (it.msgTime) meta.ts = Number(it.msgTime) || 0;
            const rt = Number(it.readTime || 0);
            if (rt > Number(state.lastRead[key] || 0)) state.lastRead[key] = rt;
          }
          saveLastRead();
        } catch (e) {
          if (!isCurrent()) return;
          // 老服务端没有 lastMsg 就留空。
        }

        // 群列表（自建群走 HTTP；拿到后才有群会话可切）
        await loadGroups(generation);
        if (!isCurrent()) return;
        await loadMoods(generation);
        if (!isCurrent()) return;
        await loadBond(generation);
        if (!isCurrent()) return;
        await Promise.all([
          loadVoiceConfigs(generation),
          loadServiceSettings(generation),
        ]);
        if (!isCurrent()) return;
        restorePeer();
        if (isGroup()) {
          loadGroupDetail(state.peer.id);
          loadGroupFiles(state.peer.id);
        }
        applyIdentity();
        applyChatTheme();
        renderConvList();
        renderContactList();
        if (state.token) els.settingsToken.value = state.token;

        // 多端同步：连接时把每个会话都补齐，而不是只补当前打开的这一个。
        await syncAllConversations();
        if (!isCurrent()) return;
        state.ready = true;
        const buffered = state.liveBuffer.splice(0);
        for (const ev of buffered) {
          if (!isCurrent()) return;
          onEvent(ev, true);
        }

        state.connected = true;
        state.everConnected = true;
        state.connecting = false;
        hideConnect();
        setConn('ok', '已连接');
        els.settingsUrl.textContent = location.host;
        state.reconnectDelay = 1000;
        scrollToBottom(false);
      } catch (e) {
        if (!isCurrent()) return;
        state.ws = null;
        state.wsGeneration += 1;
        state.connected = false;
        state.connecting = false;
        state.ready = false;
        state.liveBuffer = [];
        rejectAllPending('握手失败，请重试');
        discardSocket(ws);
        setConn('bad', '握手失败');
        scheduleReconnect();
      }
    };

    ws.onmessage = (e) => {
      if (!isCurrent()) return;
      state.lastFrame = Date.now();
      let data;
      try { data = JSON.parse(e.data); } catch (err) { return; }

      if (data && data.echo && state.pending.has(data.echo)) {
        const p = state.pending.get(data.echo);
        if (p.ws !== ws || p.generation !== generation) return;
        state.pending.delete(data.echo);
        clearTimeout(p.timer);
        if (data.status === 'failed') p.reject(new Error(data.wording || '请求失败'));
        else p.resolve(data);
        return;
      }
      onEvent(data);
    };

    ws.onerror = () => { /* onclose 里统一处理 */ };

    ws.onclose = (e) => {
      if (!isCurrent()) return;
      state.ws = null;
      state.wsGeneration += 1;
      state.connected = false;
      state.connecting = false;
      state.ready = false;
      state.liveBuffer = [];
      rejectAllPending('连接已断开');
      discardSocket(ws);
      if (e && e.code === 1008) {
        // 服务端启用了 access_token，但本地没有/不对
        if (!state.everConnected) {
          showConnect('访问令牌不正确，请填写后重试', true);
        } else if (els.appView.classList.contains('hidden')) {
          showConnect('访问令牌不正确，请填写后重试', true);
        } else {
          openSettings();
          els.settingsToken.focus();
          toast('访问令牌不正确，请重新填写');
        }
        setConn('bad', '需要访问令牌');
        return;
      }
      setConn('bad', '连接已断开');
      if (els.appView.classList.contains('hidden')) {
        els.connectState.classList.add('bad');
        els.connectStateText.textContent = '连接不上 星伴，正在重试…';
      }
      scheduleReconnect();
    };
  }

  function scheduleReconnect() {
    clearTimeout(state.reconnectTimer);
    const delay = Math.min(10000, state.reconnectDelay);
    state.reconnectDelay = Math.min(10000, Math.round(state.reconnectDelay * 1.7));
    state.reconnectTimer = setTimeout(connect, delay);
  }

  function applyIdentity() {
    els.meName.textContent = state.me.name;
    fillAvatar(els.railAvatar, state.me.name, state.me.id, '我');
    fillAvatar(els.mobileAvatar, state.me.name, state.me.id, '我');
    els.mobileName.textContent = state.me.name;
    applyChatSettingsIdentity();
    applyFavicon();
    applyPeerIdentity();
    loadAvatars();
    loadStickerSets();
    loadPresence();
    if (state.token) {
      els.settingsToken.value = state.token;
      els.tokenInput.value = state.token;
    }
  }

  // 「聊天设置」弹窗代表的是**当前私聊角色**。这几行以前只写在 applyIdentity()
  // 里，而它只在连接握手时跑一次 —— 于是切换会话后弹窗一直显示同一个人
  // （实测 bug：每个人的聊天设置都长一样）。现在它跟着每次切会话一起刷新。
  function applyChatSettingsIdentity() {
    const name = state.bot.name;
    fillAvatar(els.csAvatar, name, state.bot.id);
    // ★ 弹窗顶部那颗「聊天对象头像」预览也必须跟着走 —— 以前漏了它，
    //   所以不管切到谁，预览里永远是默认的那个字。
    fillAvatar(els.csAvatarPreview, name, state.bot.id);
    fillAvatar(els.csPreviewInAvatar, name, state.bot.id);
    fillAvatar(els.csPreviewOutAvatar, state.me.name, state.me.id, '我');
    els.csTitle.textContent = name;
    if (els.csSubTitle) {
      els.csSubTitle.textContent = `头像 / 背景 / 气泡 · 只对「${name}」生效`;
    }
    if (els.csAvatar) els.csAvatar.title = `点击更换「${name}」的头像`;
    if (els.csAvatarPreview) els.csAvatarPreview.title = `点击更换「${name}」的头像`;
    const incomingLabel = els.csSideSeg?.querySelector('[data-side="in"]');
    if (incomingLabel) incomingLabel.textContent = `${name}的气泡`;
    const stickerHint = els.csStickerGroups?.parentElement?.querySelector('.cs-hint');
    if (stickerHint) stickerHint.textContent = `取消勾选后，${name}不会使用这些表情包，表情面板里也不显示。`;
  }

  // 当前会话（私聊 / 群聊）的身份：标题 / 头像 / 副标题 / 输入框提示 / 文档标题。
  // 私聊专属的入口（聊天设置、表情包管理）在群里隐藏，群专属入口（群设置、
  // @全体、右侧面板）在私聊里隐藏。
  function applyPeerIdentity() {
    const g = isGroup();
    // ★ 聊天设置弹窗的内容跟着当前私聊角色走（群里虽然打不开它，但切回私聊时
    //   必须是那个人的信息）
    applyChatSettingsIdentity();
    els.chatName.textContent = curPeerName();
    els.chatName.tabIndex = g ? -1 : 0;
    els.chatName.title = g ? curPeerName() : '查看角色资料';
    if (g) {
      els.chatName.removeAttribute('role');
      els.chatName.removeAttribute('aria-label');
      els.chatName.removeAttribute('aria-haspopup');
    } else {
      els.chatName.setAttribute('role', 'button');
      els.chatName.setAttribute('aria-label', `查看${curPeerName()}的资料`);
      els.chatName.setAttribute('aria-haspopup', 'dialog');
    }
    if (els.chatAvatar) {
      els.chatAvatar.classList.remove('hidden');
      els.chatAvatar.classList.toggle('group-avatar', g);
      els.chatAvatar.classList.toggle('bot-avatar', !g);
      if (g) fillGroupAvatar(els.chatAvatar, curPeerName(), state.peer.id);
      else fillAvatar(els.chatAvatar, curPeerName(), state.bot.id);
      els.chatAvatar.title = g ? '查看群资料' : `查看${curPeerName()}的资料`;
      els.chatAvatar.setAttribute('aria-label', g ? '查看群资料' : `查看${curPeerName()}的资料`);
    }
    document.querySelectorAll('.private-peer-action').forEach((button) => {
      button.classList.toggle('hidden', g);
    });
    if (els.chatBondChip) {
      const showBond = !g && state.bot && isBound(state.bot.id);
      els.chatBondChip.classList.toggle('hidden', !showBond);
    }
    if (g) {
      const d = state.groupDetail[String(state.peer.id)];
      const n = d ? (d.member_count || (d.members || []).length)
                  : ((groupById(state.peer.id) || {}).member_count || 0);
      const muted = d ? !!d.mute_all : !!((groupById(state.peer.id) || {}).mute_all);
      els.chatSub.textContent = (muted ? '全员禁言中 · ' : '') + `${n} 人`;
    } else {
      els.chatSub.textContent = state.connected ? connectedPrivateSubtitle() : '连接中…';
      fillAvatar(els.emptyAvatar, state.bot.name, state.bot.id);
      const emptyText = els.emptyState.querySelector('p');
      if (emptyText) emptyText.textContent = `和${state.bot.name}打个招呼吧`;
    }
    els.input.placeholder = state.connected
      ? `和${curPeerName()}说点什么…` : '连接断开，正在重连…';
    updateDocTitle();
    if (els.btnChatStyle) els.btnChatStyle.classList.toggle('hidden', g);
    if (els.voiceBtn) els.voiceBtn.classList.toggle('hidden', g);
    if (els.btnGroupSet) els.btnGroupSet.classList.toggle('hidden', !g);
    if (els.btnGroupAt) els.btnGroupAt.classList.toggle('hidden', !g);
    if (els.groupSide) {
      els.groupSide.classList.toggle('hidden', !g || !!state.groupSideHidden);
    }
    renderGroupSide();
  }

  // ---------------------------------------------------------- 多会话
  function rebuildMidIndex() {
    state.byMid.clear();
    for (const m of state.msgs) indexMessageMids(m);
  }

  function convMetaFor(peerId) {
    const key = String(peerId);
    if (!state.convMeta[key]) state.convMeta[key] = { preview: '', ts: 0, unread: 0 };
    return state.convMeta[key];
  }

  function conversationPrefsFor(key = curConvKey()) {
    const raw = state.convPrefs[String(key)];
    return {
      pinned: !!(raw && raw.pinned === true),
      muted: !!(raw && raw.muted === true),
      manualUnread: !!(raw && raw.manualUnread === true),
    };
  }

  function isConversationMuted(key = curConvKey()) {
    return conversationPrefsFor(key).muted;
  }

  function setConversationPref(key, name, value) {
    const k = String(key);
    const prefs = conversationPrefsFor(k);
    prefs[name] = !!value;
    if (prefs.pinned || prefs.muted || prefs.manualUnread) state.convPrefs[k] = prefs;
    else delete state.convPrefs[k];
    try { localStorage.setItem(LS_CONV_PREFS, JSON.stringify(state.convPrefs)); }
    catch (e) { /* 本地存储不可用时仅保留本次会话状态 */ }
  }

  function hasConversationUnread(key) {
    const k = String(key);
    return (convMetaFor(k).unread || 0) > 0 || conversationPrefsFor(k).manualUnread;
  }

  function totalUnread() {
    const keys = new Set([...Object.keys(state.convMeta), ...Object.keys(state.convPrefs)]);
    let total = 0;
    for (const key of keys) {
      const unread = convMetaFor(key).unread || 0;
      total += unread + (!unread && conversationPrefsFor(key).manualUnread ? 1 : 0);
    }
    return total;
  }

  function updateDocTitle() {
    const n = curPeerName();
    document.title = state.unread
      ? `(${state.unread}) ${n} · 星伴`
      : `${n} · 星伴`;
  }

  function saveLastRead() {
    try { localStorage.setItem('vol.lastRead', JSON.stringify(state.lastRead)); }
    catch (e) { /* 隐身模式写不了，忽略 */ }
  }

  function syncReadState(peerId, ts) {
    if (!state.ws || state.ws.readyState !== 1) return;
    const key = String(peerId);
    // 群聊的已读只存在本机（服务端 set_msg_read 没有群的语义）
    if (key.charAt(0) === 'g') return;
    const now = nowSec();
    if (now - Number(state.lastReadSent[key] || 0) < 5) return;
    state.lastReadSent[key] = now;
    call('set_msg_read', {
      user_id: Number(peerId),
      time: Math.floor(ts || now),
    }, 8000).catch(() => { /* 老服务端没有这个 action 也不影响 */ });
  }

  function markRead(peerId = curConvKey(), ts = 0) {
    const key = String(peerId);
    const prev = Number(state.lastRead[key] || 0);
    const next = Math.max(prev, Number(ts || nowSec()));
    if (next !== prev) {
      state.lastRead[key] = next;
      saveLastRead();
    }
    syncReadState(peerId, next);
  }

  function recomputeUnread(peerId = curConvKey()) {
    const key = String(peerId);
    const list = key === curConvKey() ? state.msgs : listFor(key);
    let lastRead = Number(state.lastRead[key] || 0);
    if (!lastRead && list.length) {
      // 新设备第一次同步：把当前进度当成已读，避免历史全部变成红点
      lastRead = Number(list[list.length - 1].ts || 0);
      state.lastRead[key] = lastRead;
      saveLastRead();
    }
    const n = list.filter((m) => m.dir === 'in' && !m.recalled &&
      Number(m.ts || 0) > lastRead).length;
    convMetaFor(key).unread = n;
    state.unread = totalUnread();
    updateBadges();
    updateDocTitle();
    renderConvList();
  }

  function renderConvList() {
    if (!els.convList) return;
    const q = (els.searchInput?.value || '').trim();
    els.convList.innerHTML = '';
    const cur = curConvKey();
    // 置顶会话优先；两组内部都维持最近消息倒序，私聊和群聊仍合并排列。
    const items = [];
    let order = 0;
    for (const c of state.characters) {
      const key = String(c.id);
      const meta = convMetaFor(key);
      const cache = key === cur ? state.msgs : (state.charMsgs[key] || []);
      const last = cache.length ? cache[cache.length - 1] : null;
      const draft = draftSummaryFor(key);
      const preview = draft || (hasReplyProcessing(key) ? '对方正在输入…' : (meta.preview ||
        (last ? ((last.dir === 'out' ? '我：' : '') + previewOf(last))
              : '还没有聊天，打个招呼吧')));
      const ts = meta.ts || (last ? last.ts : 0);
      items.push({ kind: 'private', id: c.id, key, name: c.name,
                   meta, prefs: conversationPrefsFor(key), preview, draft: !!draft, ts, order: order++ });
    }
    for (const g of state.groups) {
      const gid = String(g.group_id);
      const key = groupKey(gid);
      const meta = convMetaFor(key);
      const cache = key === cur ? state.msgs : (state.groupMsgs[gid] || []);
      const last = cache.length ? cache[cache.length - 1] : null;
      const draft = draftSummaryFor(key);
      let preview = draft || meta.preview;
      if (!preview && last) {
        const who = last.dir === 'out' ? '我：'
          : (last.sender ? last.sender.name + '：' : '');
        preview = who + previewOf(last);
      }
      const ts = meta.ts || (last ? last.ts : 0);
      items.push({ kind: 'group', id: gid, key, name: g.group_name || '群聊',
                   meta, prefs: conversationPrefsFor(key), preview, draft: !!draft, ts, order: order++,
                   pending: Number(g.pending || 0), muteAll: !!g.mute_all });
    }
    items.sort((a, b) => (Number(b.prefs.pinned) - Number(a.prefs.pinned)) ||
      (b.ts - a.ts) || (a.order - b.order));

    for (const it of items) {
      if (q && !(it.name.includes(q) || (it.preview || '').includes(q))) continue;

      const wrap = document.createElement('div');
      wrap.className = 'conv-wrap';
      wrap.dataset.peer = it.key;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'conv' + (it.key === cur ? ' active' : '') +
        (it.prefs.pinned ? ' pinned' : '') + (it.prefs.muted ? ' muted' : '');
      btn.dataset.peer = it.key;

      const av = document.createElement('div');
      av.className = 'avatar ' + (it.kind === 'group' ? 'group-avatar' : 'bot-avatar');
      if (it.kind === 'group') {
        fillGroupAvatar(av, it.name, it.id);
      } else {
        fillAvatar(av, it.name, it.id);
        addMoodDot(av, it.id);
        addBondMark(av, it.id);
      }

      const main = document.createElement('div');
      main.className = 'conv-main';
      const top = document.createElement('div');
      top.className = 'conv-top';
      const nm = document.createElement('span');
      nm.className = 'conv-name';
      nm.textContent = it.name;
      if (it.kind === 'group') {
        const tag = document.createElement('span');
        tag.className = 'conv-tag';
        tag.textContent = '群';
        nm.appendChild(tag);
      }
      const tm = document.createElement('span');
      tm.className = 'conv-time';
      tm.textContent = fmtConvTime(it.ts);
      top.append(nm, tm);

      const bottom = document.createElement('div');
      bottom.className = 'conv-bottom';
      const pv = document.createElement('span');
      pv.className = 'conv-preview';
      if (it.draft) {
        const label = document.createElement('span');
        label.className = 'conv-draft-label';
        label.textContent = '[草稿]';
        pv.append(label, document.createTextNode(' ' + it.preview));
      } else {
        pv.textContent = it.preview || (it.kind === 'group' ? '群里还很安静' : '');
      }
      bottom.appendChild(pv);
      if (it.prefs.muted) {
        const mute = document.createElement('span');
        mute.className = 'conv-mute';
        mute.title = '已免打扰';
        mute.setAttribute('aria-label', '已免打扰');
        mute.innerHTML = '<svg aria-hidden="true"><use href="#i-bell-off"/></svg>';
        bottom.appendChild(mute);
      }
      if (it.meta.unread > 0) {
        const bd = document.createElement('span');
        bd.className = 'badge';
        bd.textContent = it.meta.unread > 99 ? '99+' : String(it.meta.unread);
        bottom.appendChild(bd);
      } else if (it.prefs.manualUnread) {
        const dot = document.createElement('span');
        dot.className = 'conv-unread-dot';
        dot.title = '手动标记未读';
        dot.setAttribute('aria-label', '未读');
        bottom.appendChild(dot);
      } else if (it.pending > 0) {
        // 有待审的入群申请：群行挂红点数字（点进去就能审批）
        const bd = document.createElement('span');
        bd.className = 'conv-pending';
        bd.title = '有入群申请待处理';
        bd.textContent = String(it.pending);
        bottom.appendChild(bd);
      }
      main.append(top, bottom);
      btn.append(av, main);

      const more = document.createElement('button');
      more.type = 'button';
      more.className = 'conv-more';
      more.dataset.peer = it.key;
      more.title = '会话管理';
      more.setAttribute('aria-label', `${it.name}：会话管理`);
      more.setAttribute('aria-haspopup', 'menu');
      more.setAttribute('aria-controls', 'convMenu');
      more.innerHTML = '<svg aria-hidden="true"><use href="#i-more"/></svg>';

      let pressTimer = 0;
      let pressPoint = null;
      let ignoreClickUntil = 0;
      const cancelPress = () => {
        clearTimeout(pressTimer);
        pressTimer = 0;
        pressPoint = null;
      };
      btn.addEventListener('pointerdown', (e) => {
        if (!e.isPrimary || (e.pointerType !== 'touch' && e.pointerType !== 'pen')) return;
        cancelPress();
        pressPoint = { x: e.clientX, y: e.clientY };
        pressTimer = window.setTimeout(() => {
          pressTimer = 0;
          pressPoint = null;
          ignoreClickUntil = Date.now() + 1000;
          openConversationActions(it.key, btn);
        }, 550);
      });
      btn.addEventListener('pointermove', (e) => {
        if (pressPoint && Math.hypot(e.clientX - pressPoint.x, e.clientY - pressPoint.y) > 12) {
          cancelPress();
        }
      });
      ['pointerup', 'pointercancel', 'pointerleave'].forEach((name) => {
        btn.addEventListener(name, cancelPress);
      });
      wrap.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        if (window.matchMedia('(max-width: 880px)').matches) {
          ignoreClickUntil = Date.now() + 1000;
          openConversationActions(it.key, btn);
          return;
        }
        const rect = btn.getBoundingClientRect();
        openConversationMenu(it.key, e.clientX || rect.right, e.clientY || rect.top, btn);
      });
      btn.addEventListener('click', (e) => {
        if (Date.now() < ignoreClickUntil) {
          e.preventDefault();
          return;
        }
        selectPeer(it.kind, it.id);
        if (window.matchMedia('(max-width: 880px)').matches) openMobileChat();
      });
      more.addEventListener('click', (e) => {
        e.stopPropagation();
        if (window.matchMedia('(max-width: 880px)').matches) {
          openConversationActions(it.key, more);
          return;
        }
        if (state.convMenuFor?.key === it.key && !els.convMenu.classList.contains('hidden')) {
          closeConversationMenu(true);
          return;
        }
        const rect = more.getBoundingClientRect();
        openConversationMenu(it.key, rect.right, rect.bottom + 4, more);
      });
      wrap.append(btn, more);
      els.convList.appendChild(wrap);
    }
  }

  function syncConversationActions(container, key) {
    const prefs = conversationPrefsFor(key);
    const labels = {
      pin: prefs.pinned ? '取消置顶' : '置顶',
      mute: prefs.muted ? '取消免打扰' : '免打扰',
      unread: hasConversationUnread(key) ? '清除未读' : '标记未读',
    };
    for (const [act, text] of Object.entries(labels)) {
      const btn = container.querySelector(`[data-conv-act="${act}"]`);
      if (!btn) continue;
      const label = btn.querySelector('span');
      if (label) label.textContent = text;
      else btn.textContent = text;
      if (act === 'unread') {
        const use = btn.querySelector('use');
        if (use) use.setAttribute('href', hasConversationUnread(key) ? '#i-check' : '#i-chat');
      }
    }
  }

  function focusConversationReturn(ref) {
    if (!ref) return;
    const original = ref.returnFocus;
    requestAnimationFrame(() => {
      let target = original && original.isConnected ? original : null;
      if (!target) {
        const wrap = [...els.convList.querySelectorAll('.conv-wrap')]
          .find((node) => node.dataset.peer === ref.key);
        target = wrap && wrap.querySelector(original?.classList.contains('conv-more') ? '.conv-more' : '.conv');
      }
      if (target) target.focus({ preventScroll: true });
    });
  }

  function closeConversationMenu(restoreFocus = false) {
    const ref = state.convMenuFor;
    els.convMenu.classList.add('hidden');
    state.convMenuFor = null;
    if (restoreFocus) focusConversationReturn(ref);
  }

  function closeConversationActions(restoreFocus = false) {
    const ref = state.convActionsFor;
    els.convActions.classList.add('hidden');
    state.convActionsFor = null;
    if (restoreFocus) focusConversationReturn(ref);
  }

  function openConversationMenu(key, x, y, trigger) {
    const k = String(key);
    closeCtx();
    closeConversationActions(false);
    state.convMenuFor = { key: k, returnFocus: trigger || document.activeElement };
    syncConversationActions(els.convMenu, k);
    els.convMenu.classList.remove('hidden');
    const rect = els.convMenu.getBoundingClientRect();
    els.convMenu.style.left = Math.max(8, Math.min(x, window.innerWidth - rect.width - 8)) + 'px';
    els.convMenu.style.top = Math.max(8, Math.min(y, window.innerHeight - rect.height - 8)) + 'px';
    requestAnimationFrame(() => {
      const first = els.convMenu.querySelector('button');
      if (first && !els.convMenu.classList.contains('hidden')) first.focus({ preventScroll: true });
    });
  }

  function openConversationActions(key, trigger) {
    const k = String(key);
    if (state.convActionsFor?.key === k && !els.convActions.classList.contains('hidden')) return;
    closeCtx();
    closeConversationMenu(false);
    closeMobileActions(false);
    state.convActionsFor = { key: k, returnFocus: trigger || document.activeElement };
    syncConversationActions(els.convActions, k);
    els.convActions.classList.remove('hidden');
    requestAnimationFrame(() => {
      const first = els.convActions.querySelector('button[data-conv-act]');
      if (first && !els.convActions.classList.contains('hidden')) first.focus({ preventScroll: true });
    });
  }

  function runConversationAction(key, act) {
    const k = String(key);
    const prefs = conversationPrefsFor(k);
    if (act === 'pin' || act === 'mute') {
      const name = act === 'pin' ? 'pinned' : 'muted';
      const next = !prefs[name];
      setConversationPref(k, name, next);
      renderConvList();
      toast(act === 'pin' ? (next ? '已置顶' : '已取消置顶')
                          : (next ? '已免打扰' : '已取消免打扰'));
      return;
    }
    if (act !== 'unread') return;
    if (hasConversationUnread(k)) {
      if (prefs.manualUnread) setConversationPref(k, 'manualUnread', false);
      clearUnread(k);
      toast('已清除未读');
    } else {
      setConversationPref(k, 'manualUnread', true);
      state.unread = totalUnread();
      updateBadges();
      updateDocTitle();
      renderConvList();
      toast('已标记未读');
    }
  }

  function handleConversationKeys(e, container) {
    const items = [...container.querySelectorAll('button:not([disabled])')]
      .filter((btn) => btn.getClientRects().length);
    if (!items.length) return;
    const active = document.activeElement;
    const index = items.indexOf(active);
    let next = -1;
    if (e.key === 'ArrowDown') next = (index + 1 + items.length) % items.length;
    else if (e.key === 'ArrowUp') next = (index - 1 + items.length) % items.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = items.length - 1;
    if (next >= 0) {
      e.preventDefault();
      items[next].focus();
      return;
    }
    if (e.key === 'Tab' && container === els.convActions) {
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && (active === first || !container.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !container.contains(active))) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  els.convMenu.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-conv-act]');
    if (!btn || !state.convMenuFor) return;
    const ref = state.convMenuFor;
    closeConversationMenu(true);
    runConversationAction(ref.key, btn.dataset.convAct);
  });
  els.convMenu.addEventListener('keydown', (e) => handleConversationKeys(e, els.convMenu));
  els.convActions.addEventListener('click', (e) => {
    if (e.target === els.convActions || e.target.closest('[data-conv-cancel]')) {
      closeConversationActions(true);
      return;
    }
    const btn = e.target.closest('button[data-conv-act]');
    if (!btn || !state.convActionsFor) return;
    const ref = state.convActionsFor;
    closeConversationActions(true);
    runConversationAction(ref.key, btn.dataset.convAct);
  });
  els.convActions.addEventListener('keydown', (e) => handleConversationKeys(e, els.convActions));

  function contactEntries() {
    const friends = state.characters.map((c) => {
      const mood = moodOf(c.id);
      return {
        kind: 'private', id: String(c.id), key: String(c.id), name: c.name,
        sub: String(mood?.line || '').trim() || '点这里开始聊天',
      };
    });
    const groups = state.groups.map((g) => {
      const id = String(g.group_id);
      return {
        kind: 'group', id, key: groupKey(id), name: g.group_name || '群聊',
        sub: `${Number(g.member_count || 0)} 人`,
      };
    });
    return { friends, groups };
  }

  function contactAvatar(item) {
    const av = document.createElement('div');
    av.className = 'avatar ' + (item.kind === 'group' ? 'group-avatar' : 'bot-avatar');
    if (item.kind === 'group') fillGroupAvatar(av, item.name, item.id);
    else {
      fillAvatar(av, item.name, item.id);
      addMoodDot(av, item.id);
      addBondMark(av, item.id);
    }
    return av;
  }

  function syncDesktopContactActive() {
    if (!els.desktopContactList) return;
    const current = curConvKey();
    els.desktopContactList.querySelectorAll('.desktop-contact[data-peer]').forEach((btn) => {
      const active = btn.dataset.peer === current;
      btn.classList.toggle('active', active);
      if (active) btn.setAttribute('aria-current', 'true');
      else btn.removeAttribute('aria-current');
    });
  }

  function renderDesktopContacts() {
    if (!els.desktopContactList) return;
    const { friends, groups } = contactEntries();
    const total = friends.length + groups.length;
    const query = (els.desktopContactSearch?.value || '').trim();
    const normalized = query.toLocaleLowerCase();
    els.desktopContactCount.textContent = `好友 ${friends.length} · 群聊 ${groups.length}`;
    els.desktopContactList.innerHTML = '';

    const showEmpty = (title, hint) => {
      const empty = document.createElement('div');
      empty.className = 'desktop-contact-empty';
      empty.setAttribute('role', 'status');
      const strong = document.createElement('strong');
      strong.textContent = title;
      const span = document.createElement('span');
      span.textContent = hint;
      empty.append(strong, span);
      els.desktopContactList.appendChild(empty);
    };
    if (!total) {
      showEmpty('还没有联系人', '可先在设置中添加好友，或创建一个群聊。');
      return;
    }

    let matched = 0;
    const addSection = (label, items) => {
      const visible = items.filter((item) =>
        !normalized || String(item.name).toLocaleLowerCase().includes(normalized));
      if (!visible.length) return;
      matched += visible.length;
      const section = document.createElement('section');
      section.className = 'desktop-contact-section';
      const heading = document.createElement('h3');
      heading.className = 'desktop-contact-heading';
      heading.textContent = `${label} ${visible.length}`;
      section.appendChild(heading);
      for (const item of visible) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'desktop-contact';
        btn.dataset.kind = item.kind;
        btn.dataset.id = item.id;
        btn.dataset.peer = item.key;
        const main = document.createElement('div');
        main.className = 'desktop-contact-main';
        const strong = document.createElement('strong');
        strong.textContent = item.name;
        const span = document.createElement('span');
        span.textContent = item.sub;
        span.title = item.sub;
        main.append(strong, span);
        btn.append(contactAvatar(item), main);
        section.appendChild(btn);
      }
      els.desktopContactList.appendChild(section);
    };
    addSection('好友', friends);
    addSection('群聊', groups);
    if (!matched) showEmpty(`没有找到“${query}”`, '试试其他好友或群聊名称。');
    else syncDesktopContactActive();
  }

  function renderContactList() {
    const { friends, groups } = contactEntries();
    if (els.contactList) {
      els.contactList.innerHTML = '';
      const addRow = (item) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'mp-contact';
        const main = document.createElement('div');
        main.className = 'mp-contact-main';
        const strong = document.createElement('strong');
        strong.textContent = item.name;
        const span = document.createElement('span');
        span.textContent = item.kind === 'group'
          ? `${item.sub} · 点这里进群` : item.sub;
        main.append(strong, span);
        const chev = document.createElement('svg');
        chev.setAttribute('class', 'chev');
        chev.innerHTML = '<use href="#i-back"/>';
        btn.append(contactAvatar(item), main, chev);
        btn.addEventListener('click', () => {
          selectPeer(item.kind, item.id);
          openMobileChat();
        });
        els.contactList.appendChild(btn);
      };
      for (const item of groups) addRow(item);
      for (const item of friends) addRow(item);
      if (!groups.length && !friends.length) {
        const empty = document.createElement('p');
        empty.className = 'cs-hint';
        empty.textContent = '还没有好友，先在设置里添加一个吧。';
        els.contactList.appendChild(empty);
      }
    }
    renderDesktopContacts();
  }

  function setDesktopView(view) {
    state.desktopView = view === 'contacts' ? 'contacts' : 'messages';
    els.listPane.dataset.desktopView = state.desktopView;
    const contacts = state.desktopView === 'contacts';
    els.railMessages.classList.toggle('active', !contacts);
    els.railMessages.setAttribute('aria-pressed', String(!contacts));
    els.railContacts.classList.toggle('active', contacts);
    els.railContacts.setAttribute('aria-pressed', String(contacts));
    if (contacts) renderDesktopContacts();
  }

  els.railMessages.addEventListener('click', () => setDesktopView('messages'));
  els.railContacts.addEventListener('click', () => setDesktopView('contacts'));
  els.desktopContactSearch.addEventListener('input', renderDesktopContacts);
  els.desktopContactSearch.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowDown') return;
    const first = els.desktopContactList.querySelector('.desktop-contact');
    if (first) { e.preventDefault(); first.focus(); }
  });
  els.desktopContactList.addEventListener('click', (e) => {
    const btn = e.target.closest('.desktop-contact[data-peer]');
    if (!btn || !els.desktopContactList.contains(btn)) return;
    selectPeer(btn.dataset.kind, btn.dataset.id);
  });

  // ---------------------------------------------------------- 群聊数据层
  // 群列表 / 详情 / 管理走 HTTP（/api/groups*），群消息走 OneBot WS。
  // 用 HTTP 是因为建群、审批、改名这些动作没有对应的 OneBot action，
  // 而消息历史两条路都通，走 WS 能跟实时事件共用一套渲染。

  async function loadGroups(generation = null) {
    try {
      const res = await apiFetch('/api/groups', { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      if (generation !== null && generation !== state.wsGeneration) return;
      if (!data || data.ok === false) return;
      state.groups = Array.isArray(data.groups) ? data.groups : [];
      state.joinRequests = Array.isArray(data.requests) ? data.requests : [];
    } catch (e) { /* 老服务端没有群接口，静默 */ }
  }

  // 一眼情绪：聊天列表头像上的晴/阴/雨点，悬停显示她自己那句心里话。
  // 刻意只给三档 + 一句人话，不把效价/焦虑数字摆出来。
  async function loadMoods(generation = null) {
    try {
      const res = await apiFetch('/api/moods', { cache: 'no-store' });
      if (!res.ok) return false;
      const data = await res.json();
      if (generation !== null && generation !== state.wsGeneration) return false;
      if (!data || data.ok === false) return false;
      state.moods = (data.items && typeof data.items === 'object')
        ? data.items : {};
      return true;
    } catch (e) { return false; }
  }

  function moodOf(id) {
    return state.moods[String(id)] || null;
  }

  function addMoodDot(av, id) {
    const mood = moodOf(id);
    if (!mood) return;
    const dot = document.createElement('i');
    dot.className = 'mood-dot ' + (mood.level || 'cloud');
    dot.title = `${mood.word || ''} · ${mood.line || ''}`;
    av.appendChild(dot);
  }

  // ---------------------------------------------------------- 情侣 / 专属关系
  async function loadBond(generation = null) {
    try {
      const res = await apiFetch('/api/bond', { cache: 'no-store' });
      if (!res.ok) return false;
      const data = await res.json();
      if (generation !== null && generation !== state.wsGeneration) return false;
      if (!data || data.ok === false) return false;
      state.bond = data.bond || null;
      state.bondCandidates = Array.isArray(data.candidates)
        ? data.candidates : [];
      renderProfile();
      return true;
    } catch (e) { return false; }
  }

  function isBound(id) {
    return !!(state.bond && state.bond.active
      && String(state.bond.character_id) === String(id));
  }

  function addBondMark(av, id) {
    if (!isBound(id)) return;
    const mark = document.createElement('i');
    mark.className = 'bond-mark';
    mark.textContent = '♡';
    mark.title = '恋人';
    av.appendChild(mark);
  }

  function profileCandidate(id) {
    return state.bondCandidates.find(
      (c) => String(c.character_id) === String(id)) || null;
  }

  function renderProfileLife() {
    const summary = $('#profileLifeSummary');
    const next = $('#profileLifeNext');
    const life = state.profileLife;
    if (!summary || !next || life.peerId !== state.profileId) return;
    els.profileSharedLifeBtn.setAttribute('aria-busy', String(life.loading));
    if (life.loading) summary.textContent = '正在读取纪念日、约定与日记…';
    else if (life.error) summary.textContent = '共同生活暂时未能读取，打开后可重试';
    else {
      const count = life.anniversaries.length + life.agreements.length + life.diaries.length;
      summary.textContent = count
        ? `${life.anniversaries.length} 个纪念日 · ${life.agreements.length} 条约定 · ${life.diaries.length} 篇日记`
        : '还没有记录，从第一个重要的日子开始';
    }
    const upcoming = !life.loading && !life.error ? sharedLifeNextSummary(life) : null;
    next.textContent = upcoming ? upcoming.text : '';
    next.classList.toggle('hidden', !upcoming);
  }

  async function loadProfileLife(peerId) {
    const life = state.profileLife;
    const seq = ++life.requestSeq;
    life.loading = true;
    life.error = '';
    renderProfileLife();
    try {
      const response = await apiFetch(`/api/shared-life?peer_id=${encodeURIComponent(peerId)}`, { cache: 'no-store' });
      const data = await response.json().catch(() => ({}));
      if (seq !== life.requestSeq || state.profileId !== peerId) return;
      if (!response.ok || data.ok !== true || !Array.isArray(data.anniversaries) ||
          !Array.isArray(data.agreements) || !Array.isArray(data.diaries)) {
        throw new Error(sharedLifeApiError(data, response, '共同生活读取失败'));
      }
      life.anniversaries = data.anniversaries.filter((item) => item && typeof item === 'object');
      life.agreements = data.agreements.filter((item) => item && typeof item === 'object');
      life.diaries = data.diaries.filter((item) => item && typeof item === 'object');
    } catch (error) {
      if (seq === life.requestSeq && state.profileId === peerId) {
        life.error = sharedLifeFailure(error, '共同生活读取失败');
      }
    } finally {
      if (seq === life.requestSeq && state.profileId === peerId) {
        life.loading = false;
        renderProfileLife();
      }
    }
  }

  function openProfile(id) {
    const cid = String(id || '');
    if (!cid) return;
    state.profileId = cid;
    Object.assign(state.profileLife, {
      peerId: cid, loading: false, error: '',
      anniversaries: [], agreements: [], diaries: [],
    });
    state.profileLife.requestSeq += 1;
    renderProfile();
    if (els.profileMask) els.profileMask.classList.remove('hidden');
    renderProfileLife();
    loadMoods().then(() => { if (state.profileId === cid) renderProfile(); });
    loadBond();
    loadProfileLife(cid);
  }

  function closeProfile() {
    state.profileId = '';
    state.profileLife.requestSeq += 1;
    state.profileLife.peerId = '';
    state.profileLife.loading = false;
    if (els.profileMask) els.profileMask.classList.add('hidden');
  }

  function syncPersonaControls() {
    const editor = state.personaEditor;
    els.personaEditor.disabled = editor.busy || !editor.peerId;
    els.personaSave.disabled = editor.busy || !editor.peerId || !editor.dirty;
    els.personaSave.textContent = editor.busy ? '正在保存…' : '保存人设';
    els.personaCount.textContent = `${els.personaEditor.value.length} / 12000`;
  }

  function renderPersonaVersions() {
    const editor = state.personaEditor;
    els.personaVersions.textContent = '';
    if (!editor.versions.length) {
      const empty = document.createElement('div');
      empty.className = 'persona-version-empty';
      empty.textContent = '还没有历史版本。第一次保存修改时，会自动备份当前人设。';
      els.personaVersions.appendChild(empty);
      return;
    }
    for (const version of editor.versions) {
      const card = document.createElement('article');
      card.className = 'persona-version-card';
      const head = document.createElement('div');
      head.className = 'persona-version-head';
      const title = document.createElement('strong');
      title.textContent = version.reason || '修改前';
      const time = document.createElement('time');
      const date = new Date(version.created_at || '');
      time.textContent = Number.isNaN(date.getTime()) ? '时间未知'
        : date.toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit',
          hour: '2-digit', minute: '2-digit' });
      head.append(title, time);
      const preview = document.createElement('p');
      preview.textContent = version.preview || '（空版本）';
      const footer = document.createElement('div');
      footer.className = 'persona-version-footer';
      const size = document.createElement('span');
      size.textContent = `${version.length || 0} 字`;
      const restore = document.createElement('button');
      restore.type = 'button';
      restore.className = 'ghost mini-btn';
      restore.textContent = '恢复此版本';
      restore.disabled = editor.busy;
      restore.addEventListener('click', () => restorePersonaVersion(version.id));
      footer.append(size, restore);
      card.append(head, preview, footer);
      els.personaVersions.appendChild(card);
    }
  }

  function applyPersonaCard(card) {
    const editor = state.personaEditor;
    editor.peerId = String(card.peer_id || '');
    editor.revision = String(card.revision || '');
    editor.versions = Array.isArray(card.versions) ? card.versions : [];
    editor.dirty = false;
    els.personaTitle.textContent = `${card.name || '角色'} · 编辑人设`;
    els.personaEditor.value = card.persona_md || '';
    els.personaStatus.textContent = `已读取磁盘版本 ${editor.revision.slice(0, 12)}；保存前会自动备份。`;
    renderPersonaVersions();
    syncPersonaControls();
  }

  async function openPersonaEditor(peerId) {
    const cid = String(peerId || '');
    if (!cid) return;
    const editor = state.personaEditor;
    const seq = ++editor.requestSeq;
    editor.peerId = '';
    editor.revision = '';
    editor.versions = [];
    editor.busy = true;
    editor.dirty = false;
    els.profileMask.classList.add('hidden');
    els.personaMask.classList.remove('hidden');
    els.personaTitle.textContent = '编辑人设';
    els.personaEditor.value = '';
    els.personaStatus.textContent = '正在读取最新人设与历史版本…';
    renderPersonaVersions();
    syncPersonaControls();
    try {
      const out = await characterCardRequest(
        `/api/character-card?peer_id=${encodeURIComponent(cid)}`);
      if (seq !== editor.requestSeq) return;
      applyPersonaCard(out.card);
    } catch (e) {
      if (seq === editor.requestSeq) els.personaStatus.textContent = e.message || '人设读取失败';
    } finally {
      if (seq === editor.requestSeq) {
        editor.busy = false;
        renderPersonaVersions();
        syncPersonaControls();
      }
    }
  }

  function closePersonaEditor() {
    state.personaEditor.requestSeq += 1;
    state.personaEditor.busy = false;
    els.personaMask.classList.add('hidden');
    if (state.profileId) {
      renderProfile();
      els.profileMask.classList.remove('hidden');
    }
  }

  function markPersonaDirty() {
    const editor = state.personaEditor;
    if (!editor.peerId || editor.busy) return;
    editor.dirty = true;
    els.personaStatus.textContent = '有未保存修改；保存时会先备份当前磁盘版本。';
    syncPersonaControls();
  }

  async function savePersonaCard() {
    const editor = state.personaEditor;
    if (editor.busy || !editor.peerId || !editor.dirty) return;
    const seq = editor.requestSeq;
    editor.busy = true;
    els.personaStatus.textContent = '正在备份旧版本并保存…';
    syncPersonaControls();
    renderPersonaVersions();
    try {
      const out = await characterCardRequest('/api/character-card', {
        method: 'PUT',
        body: JSON.stringify({ peer_id: editor.peerId, revision: editor.revision,
          persona_md: els.personaEditor.value }),
      });
      if (seq !== editor.requestSeq) return;
      applyPersonaCard(out.card);
      els.personaStatus.textContent = '人设已保存并立即生效；旧版本已保留。';
      toast('人设已保存，后续聊天立即使用新版本');
    } catch (e) {
      if (seq === editor.requestSeq) {
        els.personaStatus.textContent = e.status === 409
          ? '保存被阻止：另一处已经修改了人设，请重新打开后再合并。'
          : (e.message || '保存失败');
      }
    } finally {
      if (seq === editor.requestSeq) {
        editor.busy = false;
        renderPersonaVersions();
        syncPersonaControls();
      }
    }
  }

  async function restorePersonaVersion(versionId) {
    const editor = state.personaEditor;
    if (editor.busy || !editor.peerId || !versionId) return;
    if (!confirm('确定恢复这个版本吗？\n\n当前磁盘人设会先保留为新快照；未保存的编辑将被替换。')) return;
    const seq = editor.requestSeq;
    editor.busy = true;
    els.personaStatus.textContent = '正在备份当前版本并恢复…';
    syncPersonaControls();
    renderPersonaVersions();
    try {
      const out = await characterCardRequest('/api/character-card/restore', {
        method: 'POST',
        body: JSON.stringify({ peer_id: editor.peerId, revision: editor.revision,
          version_id: versionId }),
      });
      if (seq !== editor.requestSeq) return;
      applyPersonaCard(out.card);
      els.personaStatus.textContent = '历史版本已恢复；恢复前的人设也已保留。';
      toast('已恢复历史人设');
    } catch (e) {
      if (seq === editor.requestSeq) {
        els.personaStatus.textContent = e.status === 409
          ? '恢复被阻止：磁盘人设已经变化，请重新打开。'
          : (e.message || '恢复失败');
      }
    } finally {
      if (seq === editor.requestSeq) {
        editor.busy = false;
        renderPersonaVersions();
        syncPersonaControls();
      }
    }
  }

  function renderProfile() {
    const cid = String(state.profileId || '');
    if (!cid || !els.profileName) return;
    const char = (state.characters || []).find((c) => String(c.id) === cid);
    const name = char ? char.name : cid;
    els.profileName.textContent = name;
    fillAvatar(els.profileAvatar, name, cid);
    const mood = moodOf(cid);
    if (els.profileMood) {
      els.profileMood.textContent = mood
        ? [mood.word, mood.line].filter(Boolean).join(' · ')
        : '此刻心情暂未同步';
    }
    const c = profileCandidate(cid);
    const b = state.bond;
    if (els.profileStats) {
      const relation = isBound(cid) ? `恋人 · 在一起 ${b.days} 天` : '朋友';
      els.profileStats.textContent = c
        ? `${relation} · 相识 ${c.days} 天`
        : relation;
    }
    if (!els.profileBondStatus || !els.profileBondBtn) return;
    const bound = isBound(cid);
    const boundOther = !!(b && b.active && !bound);
    if (bound) {
      els.profileBondStatus.textContent = `恋人 · 在一起 ${b.days} 天`;
      els.profileBondMeta.textContent = '她是现在唯一被绑定的人；其他人是朋友。';
      els.profileBondBtn.textContent = '解除关系';
      els.profileBondBtn.disabled = false;
      els.profileBondBtn.dataset.act = 'unbind';
      els.profileBondBtn.classList.add('danger');
      if (els.profileBondHint) {
        els.profileBondHint.textContent =
          '解除后进入 72 小时冷静期，她也会真的难受一阵。';
      }
    } else {
      els.profileBondBtn.classList.remove('danger');
      els.profileBondBtn.dataset.act = 'bind';
      if (boundOther) {
        els.profileBondStatus.textContent = '朋友';
        els.profileBondMeta.textContent =
          `你已经和「${b.name}」绑定，暂时不能再绑别人。`;
        els.profileBondBtn.textContent = '先解除现有关系';
        els.profileBondBtn.disabled = true;
        if (els.profileBondHint) {
          els.profileBondHint.textContent =
            '恋人只能有一个；其他人保持朋友关系，好感和记忆都保留。';
        }
      } else if (b && b.in_cooldown) {
        const h = Math.max(1, Math.ceil(
          (b.cooldown_until * 1000 - Date.now()) / 3600000));
        els.profileBondStatus.textContent = '朋友';
        els.profileBondMeta.textContent =
          `刚解除关系，还要 ${h} 小时才能重新绑定。`;
        els.profileBondBtn.textContent = '冷静期中';
        els.profileBondBtn.disabled = true;
        if (els.profileBondHint) {
          els.profileBondHint.textContent = '其他人的好感和记忆都没有被删掉。';
        }
      } else {
        els.profileBondStatus.textContent = '朋友';
        els.profileBondMeta.textContent = (c && c.eligible)
          ? '已经达到确定关系的条件。'
          : ('还差：' + (c && c.missing && c.missing.length
              ? c.missing.join('、')
              : '好感 / 亲密 / 信任 / 相处时间'));
        els.profileBondBtn.textContent = (c && c.eligible)
          ? '确定关系' : '还差一点';
        els.profileBondBtn.disabled = !(c && c.eligible);
        if (els.profileBondHint) {
          els.profileBondHint.textContent =
            '恋人只能有一个；确定后其他人会自动回到朋友的位置。';
        }
      }
    }
    els.profileBondBtn.onclick = () => {
      if (els.profileBondBtn.dataset.act === 'unbind') unbindConfirm();
      else if (c) bindConfirm(c);
    };
  }

  async function bondPost(body) {
    try {
      const res = await apiFetch('/api/bond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body || {}),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.ok === false) {
        alert(data.error || '操作失败');
        return false;
      }
      state.bond = data.bond || null;
      state.bondCandidates = Array.isArray(data.candidates)
        ? data.candidates : [];
      renderProfile();
      renderConvList();
      applyPeerIdentity();
      return true;
    } catch (e) {
      alert('操作失败：' + (e && e.message ? e.message : e));
      return false;
    }
  }

  async function bindConfirm(c) {
    const ok = confirm(
      `确定和「${c.name}」确立恋人关系吗？\n\n` +
      '其他角色会自动回到朋友的位置，但好感和记忆都保留。');
    if (!ok) return;
    await bondPost({ action: 'bind', character_id: c.character_id });
  }

  async function unbindConfirm() {
    const name = (state.bond && state.bond.name) || '她';
    const ok = confirm(
      `要和「${name}」解除恋人关系吗？\n\n` +
      '她会真的难受一阵，而且接下来 72 小时不能再绑定任何人。');
    if (!ok) return;
    if (!confirm('真的确定吗？')) return;
    await bondPost({ action: 'unbind' });
  }

  // ---------------------------------------------------------- 回忆中心
  const MEMORY_PAGE_SIZE = 80;
  const MEMORY_CATEGORY_NAMES = Object.freeze({
    auto: '自动记忆',
    fact: '重要事实',
    nickname: '昵称',
    anniversary: '纪念日',
    agreement: '约定',
  });
  const MEMORY_SOURCE_NAMES = Object.freeze({
    memory: '长期记忆',
    profile: '用户画像',
    self_fact: '角色事实',
  });
  const MEMORY_FACT_STATUS_NAMES = Object.freeze({
    candidate: '待确认',
    confirmed: '已确认',
    conflict: '有冲突',
  });
  let memorySearchTimer = 0;

  function memoryCategoryOf(item) {
    const key = String(item && item.category || 'auto');
    return Object.prototype.hasOwnProperty.call(MEMORY_CATEGORY_NAMES, key) ? key : 'auto';
  }

  function memoryKey(item) {
    return `${String(item.source || 'memory')}:${String(item.id)}`;
  }

  function formatMemoryTime(ts) {
    const value = Number(ts);
    if (!Number.isFinite(value) || value <= 0) return '时间未知';
    const date = new Date(value > 1e12 ? value : value * 1000);
    if (Number.isNaN(date.getTime())) return '时间未知';
    const pad = (n) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
      `${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  function memoryHasMore() {
    const m = state.memories;
    return m.nextOffset < m.total;
  }

  function memoryRequestCurrent(requestId, peerId, query) {
    const m = state.memories;
    return m.requestSeq === requestId && m.peerId === peerId && m.query === query &&
      !els.memoriesMask.classList.contains('hidden');
  }

  function memoryMutationCurrent(peerId, mutationId) {
    const m = state.memories;
    return m.peerId === peerId && m.mutationSeq === mutationId;
  }

  function memoryApiError(data, res, fallback) {
    return String((data && (data.error || data.message)) ||
      `${fallback}（HTTP ${res.status}）`);
  }

  function syncMemoryFilters() {
    const selected = state.memories.category;
    els.memoriesFilters.querySelectorAll('.memory-filter').forEach((button) => {
      const active = button.dataset.category === selected;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  }

  function syncMemoryBusy() {
    const m = state.memories;
    const busy = !!m.busy;
    els.memoriesAddBtn.disabled = busy;
    els.memoriesEmptyAdd.disabled = busy;
    els.memoriesRefresh.disabled = busy || m.loading;
    els.memoriesRetry.disabled = busy || m.loading;
    els.memoriesMore.disabled = busy || m.loading;
    els.memorySave.disabled = busy;
    els.memorySave.textContent = m.busy === 'save'
      ? '保存中…' : (m.editing ? '保存纠正' : '保存回忆');
    els.memoriesList.querySelectorAll('button[data-memory-action]').forEach((button) => {
      button.disabled = busy;
    });
  }

  function createMemoryBadge(text, className, title) {
    const badge = document.createElement('span');
    badge.className = className;
    badge.textContent = text;
    if (title) badge.title = title;
    return badge;
  }

  function createMemoryAction(action, label, icon, danger = false) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'memory-action' + (danger ? ' danger' : '');
    button.dataset.memoryAction = action;
    button.title = label;
    button.innerHTML = `<svg><use href="#${icon}"/></svg>`;
    const text = document.createElement('span');
    text.textContent = label;
    button.appendChild(text);
    return button;
  }

  function renderMemories() {
    const m = state.memories;
    const active = document.activeElement;
    const oldCard = active && active.closest ? active.closest('.memory-card') : null;
    const hadListFocus = active === els.memoriesList || !!oldCard;
    const oldKey = oldCard ? oldCard.dataset.memoryKey : '';
    const oldAction = oldCard && active.dataset ? active.dataset.memoryAction : '';
    const entries = [];
    m.items.forEach((item, index) => {
      if (!m.category || memoryCategoryOf(item) === m.category) entries.push({ item, index });
    });

    els.memoriesList.replaceChildren();
    for (const entry of entries) {
      const item = entry.item;
      const category = memoryCategoryOf(item);
      const source = Object.prototype.hasOwnProperty.call(MEMORY_SOURCE_NAMES, item.source)
        ? item.source : 'memory';
      const card = document.createElement('article');
      card.className = 'memory-card' + (item.pinned ? ' pinned' : '');
      card.dataset.index = String(entry.index);
      card.dataset.memoryKey = memoryKey(item);

      const head = document.createElement('div');
      head.className = 'memory-card-head';
      const badges = document.createElement('div');
      badges.className = 'memory-badges';
      badges.appendChild(createMemoryBadge(
        MEMORY_CATEGORY_NAMES[category], `memory-badge category-${category}`));
      badges.appendChild(createMemoryBadge(MEMORY_SOURCE_NAMES[source], 'memory-badge source'));
      if (source === 'self_fact' && MEMORY_FACT_STATUS_NAMES[item.fact_status]) {
        const statusTitle = item.fact_status === 'conflict'
          ? '存在多个冲突版本；编辑并保存所选版本后才会重新确认'
          : (item.fact_status === 'candidate'
            ? '模型提出的候选，尚未进入角色的长期身份' : '会进入角色的长期身份上下文');
        badges.appendChild(createMemoryBadge(
          MEMORY_FACT_STATUS_NAMES[item.fact_status], 'memory-flag version', statusTitle));
        if (item.fact_key) {
          badges.appendChild(createMemoryBadge(
            String(item.fact_key), 'memory-flag version', '事实键'));
        }
      }
      if (item.pinned) badges.appendChild(createMemoryBadge('置顶', 'memory-flag pinned'));
      if (item.corrected_at) {
        badges.appendChild(createMemoryBadge(
          '已纠正', 'memory-flag corrected', `纠正于 ${formatMemoryTime(item.corrected_at)}`));
      }
      if (source === 'memory' && Number(item.version) > 1) {
        badges.appendChild(createMemoryBadge(
          `第 ${Number(item.version)} 版`, 'memory-flag version',
          '首次记录时间保持不变；这里显示当前有效版本'));
      }
      head.appendChild(badges);

      const text = document.createElement('p');
      text.className = 'memory-text-content';
      text.textContent = String(item.text || '');

      let evidence = null;
      const hasTurnEvidence = source === 'memory' || source === 'self_fact';
      if (hasTurnEvidence && item.evidence &&
          typeof item.evidence.text === 'string') {
        evidence = document.createElement('p');
        evidence.className = 'memory-evidence';
        const role = item.evidence.role === 'user' ? '你' : '她';
        evidence.textContent = `来源对话 · ${role}：${item.evidence.text}`;
        evidence.title = `turn #${item.evidence.turn_id} · ${formatMemoryTime(item.evidence.ts)}`;
      } else if (hasTurnEvidence && item.source_turn_id) {
        evidence = document.createElement('p');
        evidence.className = 'memory-evidence missing';
        evidence.textContent = '来源对话已删除，仅保留来源编号';
        evidence.title = `turn #${item.source_turn_id}`;
      }

      const footer = document.createElement('div');
      footer.className = 'memory-card-footer';
      const time = document.createElement('time');
      time.className = 'memory-time';
      time.textContent = formatMemoryTime(item.ts);
      if (item.updated_at) time.title = `最近更新：${formatMemoryTime(item.updated_at)}`;
      const actions = document.createElement('div');
      actions.className = 'memory-actions';
      actions.appendChild(createMemoryAction('edit', '编辑', 'i-edit'));
      const pin = createMemoryAction('pin', item.pinned ? '取消置顶' : '置顶', 'i-pin');
      pin.setAttribute('aria-pressed', String(!!item.pinned));
      actions.appendChild(pin);
      actions.appendChild(createMemoryAction('delete', '删除', 'i-trash', true));
      footer.append(time, actions);
      card.append(head, text);
      if (evidence) card.appendChild(evidence);
      card.appendChild(footer);
      els.memoriesList.appendChild(card);
    }

    let summary = '';
    if (m.total || m.items.length) {
      summary = m.query ? `搜索“${m.query}” · 共 ${m.total} 条` : `共 ${m.total} 条`;
      if (m.category) summary += ` · 当前分类显示 ${entries.length} 条`;
      if (memoryHasMore()) summary += ` · 已加载 ${m.items.length} 条`;
    }
    els.memoriesCount.textContent = summary;
    els.memoriesLoading.classList.toggle('hidden', !m.loading);
    els.memoriesLoadingText.textContent = m.loadingMore ? '正在加载更多回忆…' : '正在读取回忆…';
    els.memoriesError.classList.toggle('hidden', !m.error);
    els.memoriesErrorText.textContent = m.error || '';

    const showEmpty = !m.loading && !m.error && !entries.length;
    els.memoriesEmpty.classList.toggle('hidden', !showEmpty);
    if (showEmpty) {
      if (m.items.length && m.category) {
        els.memoriesEmptyTitle.textContent =
          `已加载的回忆中没有「${MEMORY_CATEGORY_NAMES[m.category]}」`;
        els.memoriesEmptyText.textContent = memoryHasMore()
          ? '可点下方“继续加载并筛选”查找更多。' : '换个分类看看，或新增一条这个分类的回忆。';
      } else if (m.query) {
        els.memoriesEmptyTitle.textContent = '没有找到相关回忆';
        els.memoriesEmptyText.textContent = '换个关键词试试，或清空搜索后再看。';
      } else {
        els.memoriesEmptyTitle.textContent = '还没有长期记忆';
        els.memoriesEmptyText.textContent = '可以手动新增一条，让她记住重要的事。';
      }
    }
    els.memoriesEmptyAdd.classList.toggle('hidden', !!m.query);
    els.memoriesList.classList.toggle('hidden', !entries.length);
    els.memoriesMore.classList.toggle('hidden',
      !memoryHasMore() || (!!m.error && !m.items.length));
    els.memoriesMore.textContent = m.loadingMore
      ? '正在加载…' : (m.category ? '继续加载并筛选' : '加载更多');
    syncMemoryBusy();

    if (hadListFocus && !els.memoriesMask.classList.contains('hidden')) {
      const cards = [...els.memoriesList.querySelectorAll('.memory-card')];
      const sameCard = cards.find((card) => card.dataset.memoryKey === oldKey);
      const targetCard = sameCard || cards[0];
      const target = targetCard
        ? targetCard.querySelector(`[data-memory-action="${oldAction || 'edit'}"]`) ||
          targetCard.querySelector('button')
        : els.memoriesSearch;
      if (target) target.focus({ preventScroll: true });
    }
  }

  async function loadMemories({ append = false } = {}) {
    const m = state.memories;
    if (!m.peerId || (append && m.loading)) return;
    if (!append) {
      clearTimeout(memorySearchTimer);
      m.query = els.memoriesSearch.value.trim();
      m.items = [];
      m.total = 0;
      m.nextOffset = 0;
    }
    const peerId = m.peerId;
    const query = m.query;
    const offset = append ? m.nextOffset : 0;
    const requestId = ++m.requestSeq;
    m.loading = true;
    m.loadingMore = append;
    m.error = '';
    renderMemories();

    let url = `/api/memories?peer_id=${encodeURIComponent(peerId)}` +
      `&offset=${offset}&limit=${MEMORY_PAGE_SIZE}`;
    if (query) url += `&q=${encodeURIComponent(query)}`;
    try {
      const res = await apiFetch(url, { cache: 'no-store' });
      const data = await res.json().catch(() => ({}));
      if (!memoryRequestCurrent(requestId, peerId, query)) return;
      if (!res.ok || data.ok !== true || !Array.isArray(data.items)) {
        throw new Error(memoryApiError(data, res, '回忆加载失败'));
      }
      const page = data.items.filter((item) =>
        item && typeof item === 'object' && item.id !== undefined && item.id !== null);
      if (append) {
        const known = new Set(m.items.map(memoryKey));
        for (const item of page) {
          if (!known.has(memoryKey(item))) {
            m.items.push(item);
            known.add(memoryKey(item));
          }
        }
      } else {
        m.items = page;
      }
      const total = Number(data.total);
      m.total = Number.isFinite(total) && total >= 0 ? total : m.items.length;
      const responseOffset = Number(data.offset);
      const base = Number.isFinite(responseOffset) && responseOffset >= 0
        ? responseOffset : offset;
      m.nextOffset = page.length ? base + page.length : m.total;
    } catch (e) {
      if (memoryRequestCurrent(requestId, peerId, query)) {
        m.error = String(e && e.message ? e.message : e || '回忆加载失败');
      }
    } finally {
      if (memoryRequestCurrent(requestId, peerId, query)) {
        m.loading = false;
        m.loadingMore = false;
        renderMemories();
      }
    }
  }

  function openMemories() {
    const peerId = String(state.profileId || '');
    if (!peerId) {
      toast('请先打开角色资料');
      return;
    }
    const m = state.memories;
    clearTimeout(memorySearchTimer);
    Object.assign(m, {
      peerId,
      items: [],
      total: 0,
      nextOffset: 0,
      query: '',
      category: '',
      loading: false,
      loadingMore: false,
      error: '',
      requestSeq: m.requestSeq + 1,
      editing: null,
      busy: '',
      mutationSeq: m.mutationSeq + 1,
    });
    const character = (state.characters || []).find((c) => String(c.id) === peerId);
    const name = character ? character.name : peerId;
    els.memoriesPeerName.textContent = `「${name}」的长期记忆`;
    els.memoriesSearch.value = '';
    closeMemoryEditor(false);
    syncMemoryFilters();
    els.memoriesMask.classList.remove('hidden');
    if (els.profileMask) els.profileMask.classList.add('hidden');
    loadMemories();
  }

  function closeMemories() {
    if (els.memoriesMask.classList.contains('hidden')) return;
    const m = state.memories;
    clearTimeout(memorySearchTimer);
    m.requestSeq += 1;
    m.mutationSeq += 1;
    m.peerId = '';
    m.loading = false;
    m.loadingMore = false;
    m.busy = '';
    closeMemoryEditor(false);
    els.memoriesMask.classList.add('hidden');
    if (state.profileId && els.profileMask) els.profileMask.classList.remove('hidden');
  }

  function closeMemoryEditor(restoreFocus = true) {
    const m = state.memories;
    m.editing = null;
    els.memoryEditor.classList.add('hidden');
    els.memoriesAddBtn.setAttribute('aria-expanded', 'false');
    els.memoryFormError.classList.add('hidden');
    syncMemoryBusy();
    if (restoreFocus && !els.memoriesMask.classList.contains('hidden')) {
      els.memoriesAddBtn.focus({ preventScroll: true });
    }
  }

  function openMemoryEditor(item = null) {
    const m = state.memories;
    if (m.busy) return;
    m.editing = item ? { source: item.source, id: String(item.id) } : null;
    els.memoryEditorTitle.textContent = item ? '纠正回忆' : '新增回忆';
    els.memoryText.value = item ? String(item.text || '') : '';
    els.memoryCategory.value = item ? memoryCategoryOf(item) : (m.category || 'fact');
    els.memoryPinned.checked = item ? !!item.pinned : false;
    els.memoryEditorHint.textContent = item
      ? (item.source === 'self_fact'
        ? '保存会确认这个版本，并将同事实键的其他版本标记为已替代；原始聊天不会改变。'
        : '保存会作为一次纠正记录下来，不会修改原始聊天记录。')
      : '新增只会影响长期记忆，不会修改原始聊天记录。';
    els.memoryFormError.textContent = '';
    els.memoryFormError.classList.add('hidden');
    els.memoryEditor.classList.remove('hidden');
    els.memoriesAddBtn.setAttribute('aria-expanded', 'true');
    syncMemoryBusy();
    requestAnimationFrame(() => {
      if (els.memoriesMask.classList.contains('hidden') ||
          els.memoryEditor.classList.contains('hidden')) return;
      els.memoryText.focus({ preventScroll: true });
      const end = els.memoryText.value.length;
      els.memoryText.setSelectionRange(end, end);
      els.memoryText.scrollIntoView({ block: 'nearest' });
    });
  }

  function beginMemoryMutation(kind) {
    const m = state.memories;
    m.mutationSeq += 1;
    m.busy = kind;
    syncMemoryBusy();
    return m.mutationSeq;
  }

  function endMemoryMutation(peerId, mutationId) {
    if (!memoryMutationCurrent(peerId, mutationId)) return;
    state.memories.busy = '';
    syncMemoryBusy();
  }

  async function saveMemory() {
    const m = state.memories;
    if (m.busy || !m.peerId) return;
    const text = els.memoryText.value.trim();
    if (!text) {
      els.memoryFormError.textContent = '请填写回忆正文。';
      els.memoryFormError.classList.remove('hidden');
      els.memoryText.focus();
      return;
    }
    const peerId = m.peerId;
    const editing = m.editing ? { ...m.editing } : null;
    const body = {
      peer_id: peerId,
      text,
      category: els.memoryCategory.value,
      pinned: els.memoryPinned.checked,
    };
    if (editing) {
      body.source = editing.source;
      body.id = editing.id;
      body.correct = true;
    }
    const mutationId = beginMemoryMutation('save');
    let saved = false;
    try {
      const res = await apiFetch('/api/memories', {
        method: editing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!memoryMutationCurrent(peerId, mutationId)) return;
      if (!res.ok || data.ok !== true) {
        throw new Error(memoryApiError(data, res, '保存失败'));
      }
      saved = true;
    } catch (e) {
      if (memoryMutationCurrent(peerId, mutationId)) {
        const message = '保存失败：' + String(e && e.message ? e.message : e);
        if (!els.memoryEditor.classList.contains('hidden')) {
          els.memoryFormError.textContent = message;
          els.memoryFormError.classList.remove('hidden');
        } else {
          toast(message);
        }
      }
    } finally {
      endMemoryMutation(peerId, mutationId);
    }
    if (!saved || !memoryMutationCurrent(peerId, mutationId)) return;
    if (!editing) {
      m.query = '';
      m.category = '';
      els.memoriesSearch.value = '';
      syncMemoryFilters();
    }
    closeMemoryEditor();
    toast(editing ? '纠正已保存' : '回忆已新增');
    await loadMemories();
  }

  async function toggleMemoryPin(item) {
    const m = state.memories;
    if (m.busy || !m.peerId) return;
    const peerId = m.peerId;
    const pinned = !item.pinned;
    const mutationId = beginMemoryMutation('pin');
    let changed = false;
    try {
      const res = await apiFetch('/api/memories', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          peer_id: peerId,
          source: item.source,
          id: String(item.id),
          pinned,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!memoryMutationCurrent(peerId, mutationId)) return;
      if (!res.ok || data.ok !== true) {
        throw new Error(memoryApiError(data, res, '置顶操作失败'));
      }
      changed = true;
    } catch (e) {
      if (memoryMutationCurrent(peerId, mutationId)) {
        toast('置顶操作失败：' + String(e && e.message ? e.message : e));
      }
    } finally {
      endMemoryMutation(peerId, mutationId);
    }
    if (!changed || !memoryMutationCurrent(peerId, mutationId)) return;
    toast(pinned ? '已置顶这条回忆' : '已取消置顶');
    await loadMemories();
  }

  async function deleteMemory(item) {
    const m = state.memories;
    if (m.busy || !m.peerId) return;
    const fullText = String(item.text || '');
    const snippet = fullText.length > 80 ? fullText.slice(0, 80) + '…' : fullText;
    if (!window.confirm(
      `确定删除这条长期记忆吗？\n\n“${snippet}”\n\n只会删除这条记忆，不会删除原始聊天记录。`)) return;
    const peerId = m.peerId;
    const mutationId = beginMemoryMutation('delete');
    let deleted = false;
    try {
      const res = await apiFetch('/api/memories', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          peer_id: peerId,
          source: item.source,
          id: String(item.id),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!memoryMutationCurrent(peerId, mutationId)) return;
      if (!res.ok || data.ok !== true) {
        throw new Error(memoryApiError(data, res, '删除失败'));
      }
      deleted = true;
    } catch (e) {
      if (memoryMutationCurrent(peerId, mutationId)) {
        toast('删除失败：' + String(e && e.message ? e.message : e));
      }
    } finally {
      endMemoryMutation(peerId, mutationId);
    }
    if (!deleted || !memoryMutationCurrent(peerId, mutationId)) return;
    toast('回忆已删除，原始聊天记录未受影响');
    await loadMemories();
  }

  els.profileMemoriesBtn.addEventListener('click', openMemories);
  $('#profileContinueBtn').addEventListener('click', () => {
    const cid = String(state.profileId || '');
    if (!cid) return;
    closeProfile();
    selectPeer('private', cid);
    if (window.matchMedia('(max-width: 880px)').matches) openMobileChat();
  });
  els.memoriesClose.addEventListener('click', closeMemories);
  els.memoriesMask.addEventListener('click', (e) => {
    if (e.target === els.memoriesMask) closeMemories();
  });
  els.memoriesRefresh.addEventListener('click', () => loadMemories());
  els.memoriesRetry.addEventListener('click', () => {
    loadMemories({ append: state.memories.items.length > 0 && state.memories.nextOffset > 0 });
  });
  els.memoriesMore.addEventListener('click', () => loadMemories({ append: true }));
  els.memoriesSearch.addEventListener('input', () => {
    clearTimeout(memorySearchTimer);
    memorySearchTimer = setTimeout(() => loadMemories(), 240);
  });
  els.memoriesSearch.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    loadMemories();
  });
  els.memoriesFilters.addEventListener('click', (e) => {
    const button = e.target.closest('button[data-category]');
    if (!button) return;
    state.memories.category = button.dataset.category || '';
    syncMemoryFilters();
    renderMemories();
  });
  els.memoriesAddBtn.addEventListener('click', () => {
    if (!els.memoryEditor.classList.contains('hidden') && !state.memories.editing) {
      closeMemoryEditor();
    } else {
      openMemoryEditor();
    }
  });
  els.memoriesEmptyAdd.addEventListener('click', () => openMemoryEditor());
  els.memoryEditorClose.addEventListener('click', () => closeMemoryEditor());
  els.memoryEditorCancel.addEventListener('click', () => closeMemoryEditor());
  els.memoryEditor.addEventListener('submit', (e) => {
    e.preventDefault();
    saveMemory();
  });
  els.memoriesList.addEventListener('click', (e) => {
    const button = e.target.closest('button[data-memory-action]');
    if (!button || state.memories.busy) return;
    const card = button.closest('.memory-card');
    const index = Number(card && card.dataset.index);
    const item = Number.isInteger(index) ? state.memories.items[index] : null;
    if (!item) return;
    if (button.dataset.memoryAction === 'edit') openMemoryEditor(item);
    else if (button.dataset.memoryAction === 'pin') toggleMemoryPin(item);
    else if (button.dataset.memoryAction === 'delete') deleteMemory(item);
  });

  // ---------------------------------------------------------- 共同生活
  const SHARED_LIFE_TABS = Object.freeze(['anniversaries', 'agreements', 'diaries']);
  const SHARED_LIFE_DIARY_EMPTY_ERROR = '这一天还没有足够的双方聊天，日记不会凭空生成。';
  const SHARED_LIFE_TAB_NODES = [
    { key: 'anniversaries', button: els.sharedLifeAnniversariesTab, panel: els.sharedLifeAnniversariesPanel },
    { key: 'agreements', button: els.sharedLifeAgreementsTab, panel: els.sharedLifeAgreementsPanel },
    { key: 'diaries', button: els.sharedLifeDiariesTab, panel: els.sharedLifeDiariesPanel },
  ];

  function sharedLifePad(value) {
    return String(value).padStart(2, '0');
  }

  function sharedLifeToday() {
    const now = new Date();
    return `${now.getFullYear()}-${sharedLifePad(now.getMonth() + 1)}-${sharedLifePad(now.getDate())}`;
  }

  // 不使用 new Date(datetimeLocalString)：显式按本地年月日时分构造，避免 UTC 偏移。
  function sharedLifeDateTimeToUnix(value) {
    const raw = String(value || '');
    const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(raw);
    if (!match) return null;
    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const hour = Number(match[4]);
    const minute = Number(match[5]);
    const second = Number(match[6] || 0);
    if (month < 1 || month > 12 || day < 1 || day > 31 ||
        hour > 23 || minute > 59 || second > 59) return null;
    const date = new Date(0);
    date.setFullYear(year, month - 1, day);
    date.setHours(hour, minute, second, 0);
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 ||
        date.getDate() !== day || date.getHours() !== hour ||
        date.getMinutes() !== minute || date.getSeconds() !== second) return null;
    const timestamp = date.getTime() / 1000;
    return Number.isFinite(timestamp) ? Math.floor(timestamp) : null;
  }

  function sharedLifeValidDay(value) {
    return /^\d{4}-\d{2}-\d{2}$/.test(String(value || '')) &&
      sharedLifeDateTimeToUnix(`${value}T00:00`) !== null;
  }

  function sharedLifeUnixToDateTime(value) {
    const timestamp = Number(value);
    if (!Number.isFinite(timestamp)) return '';
    const date = new Date(timestamp * 1000);
    if (Number.isNaN(date.getTime())) return '';
    return `${date.getFullYear()}-${sharedLifePad(date.getMonth() + 1)}-${sharedLifePad(date.getDate())}` +
      `T${sharedLifePad(date.getHours())}:${sharedLifePad(date.getMinutes())}`;
  }

  function sharedLifeFormatTime(value) {
    const timestamp = Number(value);
    if (!Number.isFinite(timestamp)) return '时间未知';
    const date = new Date(timestamp * 1000);
    if (Number.isNaN(date.getTime())) return '时间未知';
    return `${date.getFullYear()}-${sharedLifePad(date.getMonth() + 1)}-${sharedLifePad(date.getDate())} ` +
      `${sharedLifePad(date.getHours())}:${sharedLifePad(date.getMinutes())}`;
  }

  function sharedLifeFriendlyError(value) {
    const raw = String(value || '');
    if (raw.includes('diary requires user and assistant messages')) {
      return SHARED_LIFE_DIARY_EMPTY_ERROR;
    }
    const known = {
      'bad access_token': '登录状态已失效，请重新连接后再试。',
      'missing peer_id': '缺少角色信息，请重新打开角色资料。',
      'unknown peer_id': '找不到这个角色，请重新打开角色资料。',
      'not supported': '当前服务端还不支持共同生活。',
      'bad json': '请求格式不正确，请重试。',
      'title must not be blank': '标题不能为空。',
      'title exceeds 80 characters': '标题不能超过 80 字。',
      'note exceeds 500 characters': '纪念日备注不能超过 500 字。',
      'details exceeds 1000 characters': '约定内容不能超过 1000 字。',
      'day must be YYYY-MM-DD': '请输入有效日期。',
      'missing due_at': '请选择到期时间。',
      'invalid due_at': '请输入有效的本地到期时间。',
      'anniversary not found': '这条纪念日已不存在，请刷新后重试。',
      'agreement not found': '这条约定已不存在，请刷新后重试。',
      'diary not found': '这一天的日记已不存在，请刷新后重试。',
    };
    if (known[raw]) return known[raw];
    if (/failed to fetch|networkerror|load failed|网络连接/i.test(raw)) {
      return '网络连接失败，请检查服务是否可用后重试。';
    }
    return raw || '操作失败，请稍后重试。';
  }

  function sharedLifeFailure(error, fallback) {
    const raw = error && error.message ? error.message : String(error || '');
    const friendly = sharedLifeFriendlyError(raw);
    if (friendly === SHARED_LIFE_DIARY_EMPTY_ERROR || friendly.startsWith(fallback)) return friendly;
    return `${fallback}：${friendly}`;
  }

  function sharedLifeApiError(data, response, fallback) {
    const raw = data && (data.error || data.message);
    return raw ? sharedLifeFriendlyError(raw) : `${fallback}（HTTP ${response.status}）`;
  }

  function sharedLifeRequestCurrent(requestId, peerId) {
    const shared = state.sharedLife;
    return shared.requestSeq === requestId && shared.peerId === peerId &&
      !els.sharedLifeMask.classList.contains('hidden');
  }

  function sharedLifeMutationCurrent(peerId, mutationId) {
    const shared = state.sharedLife;
    return shared.mutationSeq === mutationId && shared.peerId === peerId &&
      !els.sharedLifeMask.classList.contains('hidden');
  }

  async function sharedLifeSend(url, method, body, fallback) {
    const response = await apiFetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || data.ok !== true) {
      throw new Error(sharedLifeApiError(data, response, fallback));
    }
    return data;
  }

  function syncSharedLifeTabs() {
    for (const node of SHARED_LIFE_TAB_NODES) {
      const active = state.sharedLife.tab === node.key;
      node.button.classList.toggle('active', active);
      node.button.setAttribute('aria-selected', String(active));
      node.button.setAttribute('aria-pressed', String(active));
      node.button.tabIndex = active ? 0 : -1;
      node.panel.classList.toggle('hidden', !active);
      node.panel.setAttribute('aria-hidden', String(!active));
    }
  }

  function selectSharedLifeTab(key, focus = false) {
    if (!SHARED_LIFE_TABS.includes(key)) return;
    state.sharedLife.tab = key;
    syncSharedLifeTabs();
    if (focus) {
      const node = SHARED_LIFE_TAB_NODES.find((entry) => entry.key === key);
      if (node) node.button.focus({ preventScroll: true });
    }
  }

  function sharedLifeBadge(text, kind = '') {
    const badge = document.createElement('span');
    badge.className = 'shared-life-badge' + (kind ? ` ${kind}` : '');
    badge.textContent = text;
    return badge;
  }

  function sharedLifeAction(action, label, icon, danger = false) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'shared-life-action' + (danger ? ' danger' : '');
    button.dataset.sharedLifeAction = action;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('aria-hidden', 'true');
    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttribute('href', `#${icon}`);
    svg.appendChild(use);
    const text = document.createElement('span');
    text.textContent = label;
    button.append(svg, text);
    return button;
  }

  function syncSharedLifeBusy() {
    const shared = state.sharedLife;
    const busy = !!shared.busy;
    const unavailable = busy || shared.loading || !shared.peerId;
    const addButtons = [
      els.sharedLifeAnniversaryAdd, els.sharedLifeAnniversaryEmptyAdd,
      els.sharedLifeAgreementAdd, els.sharedLifeAgreementEmptyAdd,
      els.sharedLifeDiaryEmptyGenerate,
    ];
    const refreshButtons = [
      els.sharedLifeAnniversaryRefresh, els.sharedLifeAnniversaryRetry,
      els.sharedLifeAgreementRefresh, els.sharedLifeAgreementRetry,
      els.sharedLifeDiaryRefresh, els.sharedLifeDiaryRetry,
    ];
    addButtons.forEach((button) => { button.disabled = unavailable; });
    refreshButtons.forEach((button) => { button.disabled = unavailable; });
    [els.sharedLifeAnniversaryForm, els.sharedLifeAgreementForm, els.sharedLifeDiaryForm]
      .forEach((form) => {
        form.querySelectorAll('input, textarea, button').forEach((control) => {
          control.disabled = unavailable;
        });
      });
    [els.sharedLifeAnniversaryList, els.sharedLifeAgreementList, els.sharedLifeDiaryList]
      .forEach((list) => {
        list.querySelectorAll('button[data-shared-life-action]').forEach((button) => {
          button.disabled = unavailable;
        });
      });

    els.sharedLifeAnniversarySave.textContent = shared.busy === 'anniversary-save'
      ? '保存中…' : (shared.editingAnniversary ? '保存修改' : '保存纪念日');
    els.sharedLifeAgreementSave.textContent = shared.busy === 'agreement-save'
      ? '保存中…' : (shared.editingAgreement ? '保存修改' : '保存约定');
    const selectedDay = els.sharedLifeDiaryDay.value;
    const hasDiary = shared.diaries.some((item) => String(item.day || '') === selectedDay);
    els.sharedLifeDiaryGenerate.textContent = shared.busy === 'diary-generate'
      ? (hasDiary ? '正在重新生成…' : '正在生成…') : (hasDiary ? '重新生成' : '生成日记');
    els.sharedLifeDiaryGenerate.setAttribute('aria-busy', String(shared.busy === 'diary-generate'));
    els.sharedLifeAnniversarySave.setAttribute('aria-busy', String(shared.busy === 'anniversary-save'));
    els.sharedLifeAgreementSave.setAttribute('aria-busy', String(shared.busy === 'agreement-save'));
  }

  function renderSharedLifeAnniversaries() {
    const shared = state.sharedLife;
    const items = shared.anniversaries;
    els.sharedLifeAnniversaryList.replaceChildren();
    for (const item of items) {
      const card = document.createElement('article');
      card.className = 'shared-life-card shared-life-anniversary-card';
      card.dataset.sharedLifeKey = String(item.id);

      const head = document.createElement('div');
      head.className = 'shared-life-card-head';
      const title = document.createElement('h4');
      title.textContent = String(item.title || '未命名纪念日');
      const badges = document.createElement('div');
      badges.className = 'shared-life-badges';
      badges.appendChild(sharedLifeBadge(item.yearly ? '每年重复' : '单次', item.yearly ? 'yearly' : 'once'));
      head.append(title, badges);

      const dates = document.createElement('div');
      dates.className = 'shared-life-date-lines';
      const original = document.createElement('p');
      original.textContent = `日期：${String(item.date || '未知')}`;
      const occurrence = document.createElement('p');
      const days = Number(item.days_until);
      if (!item.yearly && Number.isFinite(days) && days < 0) {
        original.textContent += ' · 已过去';
        original.classList.add('past');
        dates.appendChild(original);
      } else {
        let countdown = '';
        if (Number.isFinite(days)) {
          if (days === 0) countdown = '今天';
          else if (days > 0) countdown = `还有 ${days} 天`;
          else countdown = '已过去';
        }
        occurrence.textContent = `下一次日期：${String(item.next_occurrence || item.date || '未知')}` +
          (countdown ? ` · ${countdown}` : '');
        if (days === 0) occurrence.classList.add('today');
        else if (days < 0) occurrence.classList.add('past');
        dates.append(original, occurrence);
      }

      card.append(head, dates);
      if (String(item.note || '')) {
        const note = document.createElement('p');
        note.className = 'shared-life-card-content';
        note.textContent = String(item.note);
        card.appendChild(note);
      }
      const footer = document.createElement('div');
      footer.className = 'shared-life-card-footer';
      const policy = document.createElement('span');
      policy.textContent = '只记录和展示，不自动提醒';
      const actions = document.createElement('div');
      actions.className = 'shared-life-card-actions';
      actions.append(
        sharedLifeAction('edit', '编辑', 'i-edit'),
        sharedLifeAction('delete', '删除', 'i-trash', true),
      );
      footer.append(policy, actions);
      card.appendChild(footer);
      els.sharedLifeAnniversaryList.appendChild(card);
    }

    els.sharedLifeAnniversaryCount.textContent = items.length ? `共 ${items.length} 个纪念日` : '';
    els.sharedLifeAnniversaryLoading.classList.toggle('hidden', !shared.loading);
    els.sharedLifeAnniversaryError.classList.toggle('hidden', !shared.error);
    els.sharedLifeAnniversaryErrorText.textContent = shared.error || '';
    els.sharedLifeAnniversaryEmpty.classList.toggle('hidden',
      shared.loading || !!shared.error || items.length > 0);
    els.sharedLifeAnniversaryList.classList.toggle('hidden', !items.length);
    els.sharedLifeAnniversaryList.setAttribute('aria-busy', String(shared.loading));
  }

  function renderSharedLifeAgreements() {
    const shared = state.sharedLife;
    const items = shared.agreements;
    els.sharedLifeAgreementList.replaceChildren();
    for (const item of items) {
      const rawStatus = String(item.status || '');
      const status = ['pending', 'confirmed', 'followed_up'].includes(rawStatus) ? rawStatus : 'unknown';
      const card = document.createElement('article');
      card.className = `shared-life-card shared-life-agreement-card status-${status || 'unknown'}`;
      card.dataset.sharedLifeKey = String(item.id);

      const head = document.createElement('div');
      head.className = 'shared-life-card-head';
      const title = document.createElement('h4');
      title.textContent = String(item.title || '未命名约定');
      const badges = document.createElement('div');
      badges.className = 'shared-life-badges';
      const statusName = status === 'pending' ? '未确认'
        : (status === 'confirmed' ? '已确认' : (status === 'followed_up' ? '已跟进' : '状态未知'));
      badges.appendChild(sharedLifeBadge(statusName, status.replace('_', '-')));
      head.append(title, badges);

      const due = document.createElement('p');
      due.className = 'shared-life-due-time';
      due.textContent = `到期时间：${sharedLifeFormatTime(item.due_at)}（本地时间）`;
      card.append(head, due);
      if (String(item.details || '')) {
        const details = document.createElement('p');
        details.className = 'shared-life-card-content';
        details.textContent = String(item.details);
        card.appendChild(details);
      }
      const statusText = document.createElement('p');
      statusText.className = 'shared-life-status-text';
      if (status === 'pending') {
        statusText.textContent = '未确认不跟进。需要单独点击“确认约定”并完成二次确认。';
      } else if (status === 'confirmed') {
        statusText.textContent = '已确认：到期后若主动总开关关闭、主动频率为 0、临时安静、免打扰或角色休息，会顺延。';
      } else if (status === 'followed_up') {
        statusText.textContent = `跟进时间：${sharedLifeFormatTime(item.followed_up_at)}`;
      } else {
        statusText.textContent = '当前状态无法确认，请刷新后再查看。';
      }
      card.appendChild(statusText);

      const footer = document.createElement('div');
      footer.className = 'shared-life-card-footer';
      const actions = document.createElement('div');
      actions.className = 'shared-life-card-actions';
      if (status === 'pending') {
        actions.appendChild(sharedLifeAction('confirm', '确认约定', 'i-check'));
      }
      actions.append(
        sharedLifeAction('edit', '编辑', 'i-edit'),
        sharedLifeAction('delete', '删除', 'i-trash', true),
      );
      footer.appendChild(actions);
      card.appendChild(footer);
      els.sharedLifeAgreementList.appendChild(card);
    }

    els.sharedLifeAgreementCount.textContent = items.length ? `共 ${items.length} 条约定` : '';
    els.sharedLifeAgreementLoading.classList.toggle('hidden', !shared.loading);
    els.sharedLifeAgreementError.classList.toggle('hidden', !shared.error);
    els.sharedLifeAgreementErrorText.textContent = shared.error || '';
    els.sharedLifeAgreementEmpty.classList.toggle('hidden',
      shared.loading || !!shared.error || items.length > 0);
    els.sharedLifeAgreementList.classList.toggle('hidden', !items.length);
    els.sharedLifeAgreementList.setAttribute('aria-busy', String(shared.loading));
  }

  function renderSharedLifeDiaries() {
    const shared = state.sharedLife;
    const items = shared.diaries;
    const openDays = new Set(
      [...els.sharedLifeDiaryList.querySelectorAll('details[open][data-shared-life-key]')]
        .map((entry) => entry.dataset.sharedLifeKey));
    els.sharedLifeDiaryList.replaceChildren();
    for (const item of items) {
      const day = String(item.day || '');
      const card = document.createElement('details');
      card.className = 'shared-life-card shared-life-diary-card';
      card.dataset.sharedLifeKey = day;
      card.open = openDays.has(day);

      const summary = document.createElement('summary');
      summary.tabIndex = 0;
      const summaryMain = document.createElement('span');
      summaryMain.className = 'shared-life-diary-summary-main';
      const title = document.createElement('strong');
      title.textContent = String(item.title || `${day} 共同生活日记`);
      const toggle = document.createElement('span');
      toggle.className = 'shared-life-diary-toggle';
      toggle.textContent = '展开 / 收起完整日记';
      summaryMain.append(title, toggle);
      const count = Number(item.message_count);
      summary.append(summaryMain, sharedLifeBadge(
        `${Number.isFinite(count) ? count : 0} 条聊天证据`, 'diary-count'));

      const body = document.createElement('div');
      body.className = 'shared-life-diary-body';
      const meta = document.createElement('p');
      meta.className = 'shared-life-diary-meta';
      meta.textContent = `日期：${day} · 整理于 ${sharedLifeFormatTime(item.generated_at)}`;
      const content = document.createElement('div');
      content.className = 'shared-life-diary-content';
      content.textContent = String(item.content || '');
      const footer = document.createElement('div');
      footer.className = 'shared-life-card-footer';
      const policy = document.createElement('span');
      policy.textContent = '仅整理当天真实的双方聊天，不补写不存在的情节';
      const actions = document.createElement('div');
      actions.className = 'shared-life-card-actions';
      actions.append(
        sharedLifeAction('regenerate', '重新生成', 'i-refresh'),
        sharedLifeAction('delete', '删除', 'i-trash', true),
      );
      footer.append(policy, actions);
      body.append(meta, content, footer);
      card.append(summary, body);
      els.sharedLifeDiaryList.appendChild(card);
    }

    els.sharedLifeDiaryCount.textContent = items.length ? `共 ${items.length} 篇角色日记` : '';
    els.sharedLifeDiaryLoading.classList.toggle('hidden', !shared.loading);
    els.sharedLifeDiaryError.classList.toggle('hidden', !shared.error);
    els.sharedLifeDiaryErrorText.textContent = shared.error || '';
    els.sharedLifeDiaryEmpty.classList.toggle('hidden',
      shared.loading || !!shared.error || items.length > 0);
    els.sharedLifeDiaryList.classList.toggle('hidden', !items.length);
    els.sharedLifeDiaryList.setAttribute('aria-busy', String(shared.loading));
  }

  function sharedLifeNextSummary(life) {
    const upcoming = life.anniversaries
      .filter((item) => Number.isFinite(Number(item.days_until)) && Number(item.days_until) >= 0)
      .sort((a, b) => Number(a.days_until) - Number(b.days_until))[0];
    if (upcoming) {
      const days = Number(upcoming.days_until);
      return {
        tab: 'anniversaries',
        text: `${days === 0 ? '今天' : `${days} 天后`} · ${String(upcoming.title || '纪念日')}`,
      };
    }
    const agreement = life.agreements
      .filter((item) => item.status === 'confirmed' && Number.isFinite(Number(item.due_at)))
      .sort((a, b) => Math.abs(Number(a.due_at) - nowSec()) - Math.abs(Number(b.due_at) - nowSec()))[0];
    if (agreement) {
      return {
        tab: 'agreements',
        text: `${Number(agreement.due_at) <= nowSec() ? '约定已到时间' : '接下来的约定'} · ${String(agreement.title || '约定')}`,
      };
    }
    const diary = [...life.diaries].sort((a, b) => String(b.day || '').localeCompare(String(a.day || '')))[0];
    return diary ? {
      tab: 'diaries',
      text: `最近日记 · ${String(diary.day || '')} · ${String(diary.title || '角色日记')}`,
    } : null;
  }

  function renderSharedLifeOverview() {
    const shared = state.sharedLife;
    $('#sharedLifeAnniversaryTotal').textContent = String(shared.anniversaries.length);
    $('#sharedLifeAgreementTotal').textContent = String(shared.agreements.length);
    $('#sharedLifeDiaryTotal').textContent = String(shared.diaries.length);
    const next = $('#sharedLifeNext');
    const upcoming = sharedLifeNextSummary(shared);
    next.classList.toggle('error', !!shared.error);
    if (shared.error) next.textContent = '共同生活读取失败，可在下方对应分类中重试。';
    else if (shared.loading && !shared.anniversaries.length && !shared.agreements.length && !shared.diaries.length) {
      next.textContent = '正在读取共同生活…';
    } else if (upcoming) next.textContent = upcoming.text;
    else if (shared.anniversaries.length || shared.agreements.length || shared.diaries.length) {
      next.textContent = '暂无即将到来的纪念日或待跟进约定';
    } else next.textContent = '还没有记录，可以从一个重要的日子开始。';
  }

  function renderSharedLife() {
    const active = document.activeElement;
    const oldCard = active && active.closest ? active.closest('[data-shared-life-key]') : null;
    const oldList = oldCard ? oldCard.parentElement : null;
    const oldListId = oldList ? oldList.id : '';
    const oldKey = oldCard ? oldCard.dataset.sharedLifeKey : '';
    const oldAction = active && active.dataset ? active.dataset.sharedLifeAction || '' : '';

    syncSharedLifeTabs();
    renderSharedLifeOverview();
    renderSharedLifeAnniversaries();
    renderSharedLifeAgreements();
    renderSharedLifeDiaries();
    syncSharedLifeBusy();

    if (oldListId && !els.sharedLifeMask.classList.contains('hidden')) {
      const list = document.getElementById(oldListId);
      const panel = list && list.closest('.shared-life-panel');
      if (list && panel && !panel.classList.contains('hidden')) {
        const card = [...list.querySelectorAll('[data-shared-life-key]')]
          .find((entry) => entry.dataset.sharedLifeKey === oldKey);
        let target = card && oldAction
          ? card.querySelector(`[data-shared-life-action="${oldAction}"]`) : null;
        if (!target && card) target = card.querySelector('summary, button:not([disabled])');
        if (!target || target.disabled) target = list;
        target.focus({ preventScroll: true });
      }
    }
  }

  async function loadSharedLife() {
    const shared = state.sharedLife;
    const peerId = String(shared.peerId || '');
    if (!peerId) return false;
    const requestId = ++shared.requestSeq;
    shared.loading = true;
    shared.error = '';
    renderSharedLife();
    let loaded = false;
    try {
      const response = await apiFetch(
        `/api/shared-life?peer_id=${encodeURIComponent(peerId)}`, { cache: 'no-store' });
      const data = await response.json().catch(() => ({}));
      if (!sharedLifeRequestCurrent(requestId, peerId)) return false;
      if (!response.ok || data.ok !== true ||
          !Array.isArray(data.anniversaries) || !Array.isArray(data.agreements) ||
          !Array.isArray(data.diaries)) {
        throw new Error(sharedLifeApiError(data, response, '共同生活加载失败'));
      }
      shared.anniversaries = data.anniversaries.filter((item) => item && typeof item === 'object');
      shared.agreements = data.agreements.filter((item) => item && typeof item === 'object');
      shared.diaries = data.diaries.filter((item) => item && typeof item === 'object');
      // 返回角色主页时，摘要也反映刚刚完成的增删改，而不是停留在打开时的旧快照。
      if (state.profileId === peerId) {
        Object.assign(state.profileLife, {
          peerId, loading: false, error: '',
          anniversaries: [...shared.anniversaries],
          agreements: [...shared.agreements], diaries: [...shared.diaries],
        });
        renderProfileLife();
      }
      loaded = true;
    } catch (error) {
      if (sharedLifeRequestCurrent(requestId, peerId)) {
        shared.error = sharedLifeFailure(error, '共同生活加载失败');
      }
    } finally {
      if (sharedLifeRequestCurrent(requestId, peerId)) {
        shared.loading = false;
        renderSharedLife();
      }
    }
    return loaded && sharedLifeRequestCurrent(requestId, peerId);
  }

  function openSharedLife() {
    const peerId = String(state.profileId || '');
    if (!peerId) {
      toast('请先打开角色资料');
      return;
    }
    const shared = state.sharedLife;
    Object.assign(shared, {
      peerId,
      tab: 'anniversaries',
      anniversaries: [],
      agreements: [],
      diaries: [],
      loading: false,
      error: '',
      requestSeq: shared.requestSeq + 1,
      mutationSeq: shared.mutationSeq + 1,
      busy: '',
      editingAnniversary: null,
      editingAgreement: null,
      diaryDay: sharedLifeToday(),
    });
    const character = (state.characters || []).find((entry) => String(entry.id) === peerId);
    const name = character ? character.name : peerId;
    els.sharedLifeTitle.textContent = `${name} · 共同生活`;
    els.sharedLifePeerName.textContent = `「${name}」的共同生活`;
    els.sharedLifeDiaryDay.value = shared.diaryDay;
    closeSharedLifeAnniversaryEditor(false);
    closeSharedLifeAgreementEditor(false);
    els.sharedLifeDiaryFormError.textContent = '';
    els.sharedLifeDiaryFormError.classList.add('hidden');
    syncSharedLifeTabs();
    els.sharedLifeMask.classList.remove('hidden');
    if (els.profileMask) els.profileMask.classList.add('hidden');
    renderSharedLife();
    els.sharedLifeAnniversariesTab.focus({ preventScroll: true });
    loadSharedLife();
  }

  function closeSharedLife() {
    if (els.sharedLifeMask.classList.contains('hidden')) return;
    const shared = state.sharedLife;
    const peerId = shared.peerId;
    shared.requestSeq += 1;
    shared.mutationSeq += 1;
    shared.peerId = '';
    shared.loading = false;
    shared.error = '';
    shared.busy = '';
    closeSharedLifeAnniversaryEditor(false);
    closeSharedLifeAgreementEditor(false);
    els.sharedLifeMask.classList.add('hidden');
    if (state.profileId && String(state.profileId) === String(peerId) && els.profileMask) {
      els.profileMask.classList.remove('hidden');
      els.profileSharedLifeBtn.focus({ preventScroll: true });
    }
  }

  function sharedLifeShowFormError(element, message) {
    element.textContent = message;
    element.classList.remove('hidden');
  }

  function beginSharedLifeMutation(kind) {
    const shared = state.sharedLife;
    shared.mutationSeq += 1;
    shared.busy = kind;
    renderSharedLife();
    return shared.mutationSeq;
  }

  function endSharedLifeMutation(peerId, mutationId) {
    if (!sharedLifeMutationCurrent(peerId, mutationId)) return;
    state.sharedLife.busy = '';
    renderSharedLife();
  }

  function focusSharedLifeItem(kind, key, action = 'edit') {
    if (els.sharedLifeMask.classList.contains('hidden') || state.sharedLife.tab !== kind) return;
    const list = kind === 'anniversaries' ? els.sharedLifeAnniversaryList
      : (kind === 'agreements' ? els.sharedLifeAgreementList : els.sharedLifeDiaryList);
    const card = [...list.querySelectorAll('[data-shared-life-key]')]
      .find((entry) => entry.dataset.sharedLifeKey === String(key || ''));
    let target = card ? card.querySelector(`[data-shared-life-action="${action}"]`) : null;
    if (!target && card) target = card.querySelector('summary, button:not([disabled])');
    if (!target) {
      target = kind === 'anniversaries' ? els.sharedLifeAnniversaryAdd
        : (kind === 'agreements' ? els.sharedLifeAgreementAdd : els.sharedLifeDiaryDay);
    }
    if (target && !target.disabled) target.focus({ preventScroll: true });
  }

  function closeSharedLifeAnniversaryEditor(restoreFocus = true) {
    const shared = state.sharedLife;
    shared.editingAnniversary = null;
    els.sharedLifeAnniversaryForm.classList.add('hidden');
    els.sharedLifeAnniversaryAdd.setAttribute('aria-expanded', 'false');
    els.sharedLifeAnniversaryFormError.textContent = '';
    els.sharedLifeAnniversaryFormError.classList.add('hidden');
    syncSharedLifeBusy();
    if (restoreFocus && shared.tab === 'anniversaries' &&
        !els.sharedLifeMask.classList.contains('hidden')) {
      els.sharedLifeAnniversaryAdd.focus({ preventScroll: true });
    }
  }

  function openSharedLifeAnniversaryEditor(item = null) {
    const shared = state.sharedLife;
    if (shared.busy || shared.loading || !shared.peerId) return;
    selectSharedLifeTab('anniversaries');
    shared.editingAnniversary = item ? String(item.id) : null;
    els.sharedLifeAnniversaryFormTitle.textContent = item ? '编辑纪念日' : '新增纪念日';
    els.sharedLifeAnniversaryTitleInput.value = item ? String(item.title || '') : '';
    els.sharedLifeAnniversaryDate.value = item ? String(item.date || '') : '';
    els.sharedLifeAnniversaryNote.value = item ? String(item.note || '') : '';
    els.sharedLifeAnniversaryYearly.checked = item ? !!item.yearly : true;
    els.sharedLifeAnniversaryFormError.textContent = '';
    els.sharedLifeAnniversaryFormError.classList.add('hidden');
    els.sharedLifeAnniversaryForm.classList.remove('hidden');
    els.sharedLifeAnniversaryAdd.setAttribute('aria-expanded', 'true');
    syncSharedLifeBusy();
    requestAnimationFrame(() => {
      if (els.sharedLifeMask.classList.contains('hidden') ||
          els.sharedLifeAnniversaryForm.classList.contains('hidden')) return;
      els.sharedLifeAnniversaryTitleInput.focus({ preventScroll: true });
      els.sharedLifeAnniversaryTitleInput.scrollIntoView({ block: 'nearest' });
    });
  }

  async function saveSharedLifeAnniversary() {
    const shared = state.sharedLife;
    if (shared.busy || shared.loading || !shared.peerId) return;
    const title = els.sharedLifeAnniversaryTitleInput.value.trim();
    const day = els.sharedLifeAnniversaryDate.value;
    const note = els.sharedLifeAnniversaryNote.value;
    if (!title) {
      sharedLifeShowFormError(els.sharedLifeAnniversaryFormError, '请填写纪念日标题。');
      els.sharedLifeAnniversaryTitleInput.focus();
      return;
    }
    if (title.length > 80) {
      sharedLifeShowFormError(els.sharedLifeAnniversaryFormError, '纪念日标题不能超过 80 字。');
      els.sharedLifeAnniversaryTitleInput.focus();
      return;
    }
    if (!sharedLifeValidDay(day)) {
      sharedLifeShowFormError(els.sharedLifeAnniversaryFormError, '请选择有效的纪念日日期。');
      els.sharedLifeAnniversaryDate.focus();
      return;
    }
    if (note.length > 500) {
      sharedLifeShowFormError(els.sharedLifeAnniversaryFormError, '纪念日备注不能超过 500 字。');
      els.sharedLifeAnniversaryNote.focus();
      return;
    }

    const peerId = shared.peerId;
    const editing = shared.editingAnniversary ? String(shared.editingAnniversary) : '';
    const body = {
      peer_id: peerId,
      title,
      date: day,
      yearly: els.sharedLifeAnniversaryYearly.checked,
      note: note.trim(),
    };
    if (editing) body.id = editing;
    const mutationId = beginSharedLifeMutation('anniversary-save');
    let saved = false;
    let savedKey = editing;
    try {
      const data = await sharedLifeSend(
        '/api/shared-life/anniversaries', 'POST', body, '保存纪念日失败');
      if (!sharedLifeMutationCurrent(peerId, mutationId)) return;
      saved = true;
      savedKey = String((data.item && data.item.id) || editing || '');
    } catch (error) {
      if (sharedLifeMutationCurrent(peerId, mutationId)) {
        sharedLifeShowFormError(els.sharedLifeAnniversaryFormError,
          sharedLifeFailure(error, '保存纪念日失败'));
      }
    } finally {
      endSharedLifeMutation(peerId, mutationId);
    }
    if (!saved || !sharedLifeMutationCurrent(peerId, mutationId)) return;
    closeSharedLifeAnniversaryEditor(false);
    toast(editing ? '纪念日修改已保存' : '纪念日已新增；这里只记录和展示，不会自动提醒');
    await loadSharedLife();
    if (sharedLifeMutationCurrent(peerId, mutationId)) {
      focusSharedLifeItem('anniversaries', savedKey);
    }
  }

  async function deleteSharedLifeAnniversary(item) {
    const shared = state.sharedLife;
    if (shared.busy || shared.loading || !shared.peerId) return;
    if (!window.confirm(`确定删除纪念日「${String(item.title || '')}」吗？\n\n此操作无法撤销。`)) return;
    const peerId = shared.peerId;
    const itemId = String(item.id);
    const mutationId = beginSharedLifeMutation('anniversary-delete');
    let deleted = false;
    try {
      await sharedLifeSend('/api/shared-life/anniversaries', 'DELETE', {
        peer_id: peerId, id: itemId,
      }, '删除纪念日失败');
      if (!sharedLifeMutationCurrent(peerId, mutationId)) return;
      deleted = true;
    } catch (error) {
      if (sharedLifeMutationCurrent(peerId, mutationId)) {
        toast(sharedLifeFailure(error, '删除纪念日失败'));
      }
    } finally {
      endSharedLifeMutation(peerId, mutationId);
    }
    if (!deleted || !sharedLifeMutationCurrent(peerId, mutationId)) return;
    if (String(shared.editingAnniversary || '') === itemId) {
      closeSharedLifeAnniversaryEditor(false);
    }
    toast('纪念日已删除');
    await loadSharedLife();
    if (sharedLifeMutationCurrent(peerId, mutationId)) {
      focusSharedLifeItem('anniversaries', itemId);
    }
  }

  function closeSharedLifeAgreementEditor(restoreFocus = true) {
    const shared = state.sharedLife;
    shared.editingAgreement = null;
    els.sharedLifeAgreementForm.classList.add('hidden');
    els.sharedLifeAgreementAdd.setAttribute('aria-expanded', 'false');
    els.sharedLifeAgreementFormError.textContent = '';
    els.sharedLifeAgreementFormError.classList.add('hidden');
    syncSharedLifeBusy();
    if (restoreFocus && shared.tab === 'agreements' &&
        !els.sharedLifeMask.classList.contains('hidden')) {
      els.sharedLifeAgreementAdd.focus({ preventScroll: true });
    }
  }

  function openSharedLifeAgreementEditor(item = null) {
    const shared = state.sharedLife;
    if (shared.busy || shared.loading || !shared.peerId) return;
    selectSharedLifeTab('agreements');
    shared.editingAgreement = item ? String(item.id) : null;
    els.sharedLifeAgreementFormTitle.textContent = item ? '编辑约定' : '新增约定';
    els.sharedLifeAgreementTitleInput.value = item ? String(item.title || '') : '';
    els.sharedLifeAgreementDetails.value = item ? String(item.details || '') : '';
    els.sharedLifeAgreementDueAt.value = item ? sharedLifeUnixToDateTime(item.due_at) : '';
    els.sharedLifeAgreementFormHint.textContent = item
      ? '编辑保存后会回到未确认，需要重新确认；未确认不跟进。原来已确认或已跟进的状态也会被重置。'
      : '保存后保持未确认；确认后才会在到期且适合主动说话时跟进。';
    els.sharedLifeAgreementFormError.textContent = '';
    els.sharedLifeAgreementFormError.classList.add('hidden');
    els.sharedLifeAgreementForm.classList.remove('hidden');
    els.sharedLifeAgreementAdd.setAttribute('aria-expanded', 'true');
    syncSharedLifeBusy();
    requestAnimationFrame(() => {
      if (els.sharedLifeMask.classList.contains('hidden') ||
          els.sharedLifeAgreementForm.classList.contains('hidden')) return;
      els.sharedLifeAgreementTitleInput.focus({ preventScroll: true });
      els.sharedLifeAgreementTitleInput.scrollIntoView({ block: 'nearest' });
    });
  }

  async function saveSharedLifeAgreement() {
    const shared = state.sharedLife;
    if (shared.busy || shared.loading || !shared.peerId) return;
    const title = els.sharedLifeAgreementTitleInput.value.trim();
    const details = els.sharedLifeAgreementDetails.value;
    const dueLocal = els.sharedLifeAgreementDueAt.value;
    if (!title) {
      sharedLifeShowFormError(els.sharedLifeAgreementFormError, '请填写约定标题。');
      els.sharedLifeAgreementTitleInput.focus();
      return;
    }
    if (title.length > 80) {
      sharedLifeShowFormError(els.sharedLifeAgreementFormError, '约定标题不能超过 80 字。');
      els.sharedLifeAgreementTitleInput.focus();
      return;
    }
    if (details.length > 1000) {
      sharedLifeShowFormError(els.sharedLifeAgreementFormError, '约定内容不能超过 1000 字。');
      els.sharedLifeAgreementDetails.focus();
      return;
    }
    const dueAt = sharedLifeDateTimeToUnix(dueLocal);
    if (dueAt === null) {
      sharedLifeShowFormError(els.sharedLifeAgreementFormError, '请选择有效的本地到期时间。');
      els.sharedLifeAgreementDueAt.focus();
      return;
    }

    const peerId = shared.peerId;
    const editing = shared.editingAgreement ? String(shared.editingAgreement) : '';
    const body = {
      peer_id: peerId,
      title,
      details: details.trim(),
      due_at: dueAt,
    };
    if (editing) body.id = editing;
    const mutationId = beginSharedLifeMutation('agreement-save');
    let saved = false;
    let savedKey = editing;
    try {
      const data = await sharedLifeSend(
        '/api/shared-life/agreements', 'POST', body, '保存约定失败');
      if (!sharedLifeMutationCurrent(peerId, mutationId)) return;
      saved = true;
      savedKey = String((data.item && data.item.id) || editing || '');
    } catch (error) {
      if (sharedLifeMutationCurrent(peerId, mutationId)) {
        sharedLifeShowFormError(els.sharedLifeAgreementFormError,
          sharedLifeFailure(error, '保存约定失败'));
      }
    } finally {
      endSharedLifeMutation(peerId, mutationId);
    }
    if (!saved || !sharedLifeMutationCurrent(peerId, mutationId)) return;
    closeSharedLifeAgreementEditor(false);
    toast(editing ? '约定已保存并回到未确认，请重新确认' : '约定已保存；当前未确认，不会跟进');
    await loadSharedLife();
    if (sharedLifeMutationCurrent(peerId, mutationId)) {
      focusSharedLifeItem('agreements', savedKey);
    }
  }

  async function confirmSharedLifeAgreement(item) {
    const shared = state.sharedLife;
    if (shared.busy || shared.loading || !shared.peerId || String(item.status) !== 'pending') return;
    const title = String(item.title || '');
    if (!window.confirm(
      `确定确认约定「${title}」吗？\n\n` +
      '确认后才会在到期且适合主动说话时跟进。\n' +
      '到期后若主动总开关关闭、主动频率为 0、临时安静、免打扰或角色休息，会顺延。')) return;
    const peerId = shared.peerId;
    const itemId = String(item.id);
    const mutationId = beginSharedLifeMutation('agreement-confirm');
    let confirmed = false;
    try {
      await sharedLifeSend('/api/shared-life/agreements/confirm', 'POST', {
        peer_id: peerId, id: itemId,
      }, '确认约定失败');
      if (!sharedLifeMutationCurrent(peerId, mutationId)) return;
      confirmed = true;
    } catch (error) {
      if (sharedLifeMutationCurrent(peerId, mutationId)) {
        toast(sharedLifeFailure(error, '确认约定失败'));
      }
    } finally {
      endSharedLifeMutation(peerId, mutationId);
    }
    if (!confirmed || !sharedLifeMutationCurrent(peerId, mutationId)) return;
    if (String(shared.editingAgreement || '') === itemId) closeSharedLifeAgreementEditor(false);
    toast('约定已确认，将在到期且适合主动说话时跟进');
    await loadSharedLife();
    if (sharedLifeMutationCurrent(peerId, mutationId)) {
      focusSharedLifeItem('agreements', itemId);
    }
  }

  async function deleteSharedLifeAgreement(item) {
    const shared = state.sharedLife;
    if (shared.busy || shared.loading || !shared.peerId) return;
    if (!window.confirm(`确定删除约定「${String(item.title || '')}」吗？\n\n此操作无法撤销。`)) return;
    const peerId = shared.peerId;
    const itemId = String(item.id);
    const mutationId = beginSharedLifeMutation('agreement-delete');
    let deleted = false;
    try {
      await sharedLifeSend('/api/shared-life/agreements', 'DELETE', {
        peer_id: peerId, id: itemId,
      }, '删除约定失败');
      if (!sharedLifeMutationCurrent(peerId, mutationId)) return;
      deleted = true;
    } catch (error) {
      if (sharedLifeMutationCurrent(peerId, mutationId)) {
        toast(sharedLifeFailure(error, '删除约定失败'));
      }
    } finally {
      endSharedLifeMutation(peerId, mutationId);
    }
    if (!deleted || !sharedLifeMutationCurrent(peerId, mutationId)) return;
    if (String(shared.editingAgreement || '') === itemId) closeSharedLifeAgreementEditor(false);
    toast('约定已删除');
    await loadSharedLife();
    if (sharedLifeMutationCurrent(peerId, mutationId)) {
      focusSharedLifeItem('agreements', itemId);
    }
  }

  async function generateSharedLifeDiary() {
    const shared = state.sharedLife;
    if (shared.busy || shared.loading || !shared.peerId) return;
    const day = els.sharedLifeDiaryDay.value;
    if (!sharedLifeValidDay(day)) {
      sharedLifeShowFormError(els.sharedLifeDiaryFormError, '请选择有效的日记日期。');
      els.sharedLifeDiaryDay.focus();
      return;
    }
    shared.diaryDay = day;
    const peerId = shared.peerId;
    const hadDiary = shared.diaries.some((item) => String(item.day || '') === day);
    const mutationId = beginSharedLifeMutation('diary-generate');
    let generated = false;
    try {
      await sharedLifeSend('/api/shared-life/diaries/generate', 'POST', {
        peer_id: peerId, day,
      }, '日记生成失败');
      if (!sharedLifeMutationCurrent(peerId, mutationId)) return;
      generated = true;
    } catch (error) {
      if (sharedLifeMutationCurrent(peerId, mutationId)) {
        // 只显示错误，不清空 shared.diaries，重新生成失败时保留已有日记。
        sharedLifeShowFormError(els.sharedLifeDiaryFormError,
          sharedLifeFailure(error, '日记生成失败'));
      }
    } finally {
      endSharedLifeMutation(peerId, mutationId);
    }
    if (!generated || !sharedLifeMutationCurrent(peerId, mutationId)) return;
    els.sharedLifeDiaryFormError.textContent = '';
    els.sharedLifeDiaryFormError.classList.add('hidden');
    toast(hadDiary ? '这一天的日记已重新生成' : '这一天的日记已生成');
    await loadSharedLife();
    if (sharedLifeMutationCurrent(peerId, mutationId)) {
      focusSharedLifeItem('diaries', day, '');
    }
  }

  async function deleteSharedLifeDiary(item) {
    const shared = state.sharedLife;
    if (shared.busy || shared.loading || !shared.peerId) return;
    const day = String(item.day || '');
    if (!window.confirm(`确定删除 ${day} 的角色日记吗？\n\n此操作无法撤销，原始聊天不会删除。`)) return;
    const peerId = shared.peerId;
    const mutationId = beginSharedLifeMutation('diary-delete');
    let deleted = false;
    try {
      await sharedLifeSend('/api/shared-life/diaries', 'DELETE', {
        peer_id: peerId, day,
      }, '删除日记失败');
      if (!sharedLifeMutationCurrent(peerId, mutationId)) return;
      deleted = true;
    } catch (error) {
      if (sharedLifeMutationCurrent(peerId, mutationId)) {
        toast(sharedLifeFailure(error, '删除日记失败'));
      }
    } finally {
      endSharedLifeMutation(peerId, mutationId);
    }
    if (!deleted || !sharedLifeMutationCurrent(peerId, mutationId)) return;
    toast('角色日记已删除，原始聊天未受影响');
    await loadSharedLife();
    if (sharedLifeMutationCurrent(peerId, mutationId)) {
      focusSharedLifeItem('diaries', day, '');
    }
  }

  els.profileSharedLifeBtn.addEventListener('click', openSharedLife);
  els.sharedLifeClose.addEventListener('click', closeSharedLife);
  els.sharedLifeMask.addEventListener('click', (event) => {
    if (event.target === els.sharedLifeMask) closeSharedLife();
  });
  els.sharedLifeTabs.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-shared-life-tab]');
    if (button) selectSharedLifeTab(button.dataset.sharedLifeTab);
  });
  $('.shared-life-overview').addEventListener('click', (event) => {
    const button = event.target.closest('button[data-shared-life-tab]');
    if (!button) return;
    selectSharedLifeTab(button.dataset.sharedLifeTab);
    const tab = SHARED_LIFE_TABS.find((node) => node.key === button.dataset.sharedLifeTab);
    if (tab) tab.button.focus({ preventScroll: true });
  });
  els.sharedLifeTabs.addEventListener('keydown', (event) => {
    const button = event.target.closest('button[data-shared-life-tab]');
    if (!button) return;
    const current = SHARED_LIFE_TABS.indexOf(button.dataset.sharedLifeTab);
    if (current < 0) return;
    let next = current;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      next = (current + 1) % SHARED_LIFE_TABS.length;
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      next = (current - 1 + SHARED_LIFE_TABS.length) % SHARED_LIFE_TABS.length;
    } else if (event.key === 'Home') {
      next = 0;
    } else if (event.key === 'End') {
      next = SHARED_LIFE_TABS.length - 1;
    } else {
      return;
    }
    event.preventDefault();
    selectSharedLifeTab(SHARED_LIFE_TABS[next], true);
  });

  els.sharedLifeAnniversaryAdd.addEventListener('click', () => {
    if (!els.sharedLifeAnniversaryForm.classList.contains('hidden') &&
        !state.sharedLife.editingAnniversary) {
      closeSharedLifeAnniversaryEditor();
    } else {
      openSharedLifeAnniversaryEditor();
    }
  });
  els.sharedLifeAnniversaryEmptyAdd.addEventListener('click', () => openSharedLifeAnniversaryEditor());
  els.sharedLifeAnniversaryEditorClose.addEventListener('click', () => closeSharedLifeAnniversaryEditor());
  els.sharedLifeAnniversaryCancel.addEventListener('click', () => closeSharedLifeAnniversaryEditor());
  els.sharedLifeAnniversaryForm.addEventListener('submit', (event) => {
    event.preventDefault();
    saveSharedLifeAnniversary();
  });
  els.sharedLifeAnniversaryForm.addEventListener('input', () => {
    els.sharedLifeAnniversaryFormError.textContent = '';
    els.sharedLifeAnniversaryFormError.classList.add('hidden');
  });
  [els.sharedLifeAnniversaryRefresh, els.sharedLifeAnniversaryRetry,
    els.sharedLifeAgreementRefresh, els.sharedLifeAgreementRetry,
    els.sharedLifeDiaryRefresh, els.sharedLifeDiaryRetry]
    .forEach((button) => button.addEventListener('click', () => loadSharedLife()));
  els.sharedLifeAnniversaryList.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-shared-life-action]');
    const card = button && button.closest('[data-shared-life-key]');
    if (!button || !card || state.sharedLife.busy || state.sharedLife.loading) return;
    const item = state.sharedLife.anniversaries.find(
      (entry) => String(entry.id) === card.dataset.sharedLifeKey);
    if (!item) return;
    if (button.dataset.sharedLifeAction === 'edit') openSharedLifeAnniversaryEditor(item);
    else if (button.dataset.sharedLifeAction === 'delete') deleteSharedLifeAnniversary(item);
  });

  els.sharedLifeAgreementAdd.addEventListener('click', () => {
    if (!els.sharedLifeAgreementForm.classList.contains('hidden') &&
        !state.sharedLife.editingAgreement) {
      closeSharedLifeAgreementEditor();
    } else {
      openSharedLifeAgreementEditor();
    }
  });
  els.sharedLifeAgreementEmptyAdd.addEventListener('click', () => openSharedLifeAgreementEditor());
  els.sharedLifeAgreementEditorClose.addEventListener('click', () => closeSharedLifeAgreementEditor());
  els.sharedLifeAgreementCancel.addEventListener('click', () => closeSharedLifeAgreementEditor());
  els.sharedLifeAgreementForm.addEventListener('submit', (event) => {
    event.preventDefault();
    saveSharedLifeAgreement();
  });
  els.sharedLifeAgreementForm.addEventListener('input', () => {
    els.sharedLifeAgreementFormError.textContent = '';
    els.sharedLifeAgreementFormError.classList.add('hidden');
  });
  els.sharedLifeAgreementList.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-shared-life-action]');
    const card = button && button.closest('[data-shared-life-key]');
    if (!button || !card || state.sharedLife.busy || state.sharedLife.loading) return;
    const item = state.sharedLife.agreements.find(
      (entry) => String(entry.id) === card.dataset.sharedLifeKey);
    if (!item) return;
    const action = button.dataset.sharedLifeAction;
    if (action === 'edit') openSharedLifeAgreementEditor(item);
    else if (action === 'confirm') confirmSharedLifeAgreement(item);
    else if (action === 'delete') deleteSharedLifeAgreement(item);
  });

  els.sharedLifeDiaryForm.addEventListener('submit', (event) => {
    event.preventDefault();
    generateSharedLifeDiary();
  });
  els.sharedLifeDiaryDay.addEventListener('input', () => {
    state.sharedLife.diaryDay = els.sharedLifeDiaryDay.value;
    els.sharedLifeDiaryFormError.textContent = '';
    els.sharedLifeDiaryFormError.classList.add('hidden');
    syncSharedLifeBusy();
  });
  els.sharedLifeDiaryEmptyGenerate.addEventListener('click', generateSharedLifeDiary);
  els.sharedLifeDiaryList.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-shared-life-action]');
    const card = button && button.closest('[data-shared-life-key]');
    if (!button || !card || state.sharedLife.busy || state.sharedLife.loading) return;
    const item = state.sharedLife.diaries.find(
      (entry) => String(entry.day || '') === card.dataset.sharedLifeKey);
    if (!item) return;
    if (button.dataset.sharedLifeAction === 'regenerate') {
      els.sharedLifeDiaryDay.value = String(item.day || '');
      state.sharedLife.diaryDay = els.sharedLifeDiaryDay.value;
      els.sharedLifeDiaryFormError.textContent = '';
      els.sharedLifeDiaryFormError.classList.add('hidden');
      generateSharedLifeDiary();
    } else if (button.dataset.sharedLifeAction === 'delete') {
      deleteSharedLifeDiary(item);
    }
  });

  function syncGroupSummary(d) {
    if (!d || !d.group_id) return;
    const g = groupById(d.group_id);
    const pend = (d.pending || d.pending_requests || []).length;
    if (g) {
      g.group_name = d.group_name || g.group_name;
      g.member_count = d.member_count || g.member_count;
      g.mute_all = !!d.mute_all;
      g.searchable = !!d.searchable;
      g.announce = (d.announce || {}).text || '';
      g.pending = pend;
    }
  }

  // 群资料（成员/公告/参数）节流刷新：系统消息一来就刷，但别刷爆接口
  const groupDetailRefreshedAt = {};
  function refreshGroupDetailSoon(gid) {
    const g = String(gid || '');
    if (!g) return;
    const now = Date.now();
    if (now - Number(groupDetailRefreshedAt[g] || 0) < 3000) return;
    groupDetailRefreshedAt[g] = now;
    loadGroupDetail(g);
    loadGroupFiles(g);
  }

  // 群成员的「等级 / 角色 / 群名片」是动态的（说得多就升级）。气泡上的徽章
  // 是**当刻快照**，之后有人又说几句，聊天里的旧徽章就和右侧成员列表对不上
  // 了（用户实测 bug）。这里以成员表为唯一真源，把该群所有缓存消息的发送者
  // 徽章刷一遍；当前会话变了就重画。
  function syncGroupMemberMeta(gid) {
    const g = String(gid || '');
    const d = state.groupDetail[g];
    if (!d || !(d.members || []).length) return;
    const byUid = {};
    for (const m of d.members) byUid[String(m.user_id)] = m;
    const lists = [];
    if (state.groupMsgs[g]) lists.push(state.groupMsgs[g]);
    if (curConvKey() === 'g' + g && state.msgs !== state.groupMsgs[g]) {
      lists.push(state.msgs);
    }
    let changed = false;
    for (const list of lists) {
      for (const msg of list) {
        if (!msg || !msg.sender) continue;
        const m = byUid[String(msg.sender.id)];
        if (!m) continue;
        const lv = Number(m.level || 1);
        if (Number(msg.sender.level || 0) !== lv) { msg.sender.level = lv; changed = true; }
        const role = String(m.role || 'member');
        if (String(msg.sender.role || '') !== role) { msg.sender.role = role; changed = true; }
        const nm = String(m.nickname || '');
        if (nm && msg.sender.name !== nm) { msg.sender.name = nm; changed = true; }
      }
    }
    if (changed && isGroup() && String(state.peer.id) === g) renderAll(false);
  }

  // 我（群主）在这个群里的等级。以前本机刚发出去的气泡写死 level:0（=不显示
  // 徽章），一刷新又变成 LV1，和右侧成员列表里的「群主 LV_x」对不上。
  function myGroupLevel() {
    const d = curGroupDetail();
    const m = ((d && d.members) || []).find((x) => x.is_me
      || String(x.user_id) === String(state.me.id));
    return Number((m && m.level) || 1);
  }

  async function loadGroupDetail(gid, opts = {}) {
    const g = String(gid || '');
    if (!g) return null;
    try {
      const res = await apiFetch(
        `/api/groups/detail?group_id=${encodeURIComponent(g)}`,
        { cache: 'no-store' });
      if (!res.ok) return null;
      const data = await res.json();
      if (!data || data.ok === false) return null;
      state.groupDetail[g] = data;
      syncGroupSummary(data);
      syncGroupMemberMeta(g);
      if (opts.render !== false) {
        renderConvList();
        if (isGroup() && String(state.peer.id) === g) renderGroupSide();
      }
      return data;
    } catch (e) { return null; }
  }

  async function groupManage(op, body = {}) {
    const res = await apiFetch('/api/groups/manage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ op, ...body }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data || data.ok === false) {
      throw new Error((data && data.error) || '操作失败');
    }
    if (data.group_id) {
      state.groupDetail[String(data.group_id)] = data;
      syncGroupSummary(data);
      syncGroupMemberMeta(data.group_id);
      renderConvList();
      if (isGroup() && String(state.peer.id) === String(data.group_id)) {
        renderGroupSide();
      }
    }
    return data;
  }

  function restorePeer() {
    let saved = null;
    try { saved = JSON.parse(localStorage.getItem('vol.peer') || 'null'); }
    catch (e) { saved = null; }
    if (saved && saved.type === 'group' && groupById(saved.id)) {
      return setActivePeer('group', saved.id);
    }
    const savedId = Number(localStorage.getItem('vol.currentPeer') || 0);
    const char = state.characters.find((c) => c.id === savedId) ||
      (saved && saved.type === 'private'
        ? state.characters.find((c) => c.id === Number(saved.id)) : null) ||
      state.characters[0];
    if (char) return setActivePeer('private', char.id);
    if (state.groups.length) return setActivePeer('group', state.groups[0].group_id);
    return false;
  }

  // 只切「当前会话」，不拉历史、不重画（连接握手时用）
  function setActivePeer(type, id) {
    saveCurrentDraft();
    // ★ 先把「当前会话」的消息数组存回它**自己的**缓存，而且必须在分支之前
    //   按会话键存。以前的私聊分支用 state.bot.id 决定存哪 —— 而从群切回私聊时
    //   state.msgs 里装的是**群的消息**，state.bot 还停在上一个私聊角色，于是
    //   群消息被写进了那个角色的私聊缓存：之后点开她，看到的就是群聊的界面。
    const prev = curConvKey();
    const next = type === 'group' ? groupKey(id) : String(id);
    if (next !== prev) {
      stopSpeech({ clearCache: true });
      stopVoicePlayback();
      resetVoiceRecorder();
    }
    if (prev && prev !== '0') {
      if (prev.charAt(0) === 'g') state.groupMsgs[prev.slice(1)] = state.msgs;
      else state.charMsgs[prev] = state.msgs;
    }

    if (type === 'group') {
      const gid = String(id);
      if (!groupById(gid) && !state.groupDetail[gid]) return false;
      state.peer = { type: 'group', id: gid, name: groupName(gid) };
      state.msgs = state.groupMsgs[gid] || (state.groupMsgs[gid] = []);
    } else {
      const cid = Number(id);
      const char = state.characters.find((c) => c.id === cid);
      if (!char) return false;
      state.bot = char;
      state.peer = { type: 'private', id: char.id, name: char.name };
      state.msgs = state.charMsgs[char.id] || (state.charMsgs[char.id] = []);
    }
    state.lastTs = 0;
    // 渲染窗口贴底：切进来只画最近 RENDER_WINDOW 条，更早的靠「加载更早」翻。
    // 不切走不重置 —— 用户翻上去看历史时不能被新消息踹下来。
    state.winStart[curConvKey()] =
      Math.max(0, state.msgs.length - RENDER_WINDOW);
    state.pendingMentions = [];
    state.replyTo = null;
    state.groupSideHidden = window.matchMedia(
      '(min-width: 881px) and (max-width: 1050px)').matches;
    rebuildMidIndex();
    restoreCurrentDraft();
    try {
      localStorage.setItem('vol.peer',
        JSON.stringify({ type: state.peer.type, id: state.peer.id }));
    } catch (e) { /* ignore */ }
    if (state.peer.type === 'private') {
      localStorage.setItem('vol.currentPeer', String(state.peer.id));
    }
    return true;
  }

  // 完整的会话切换：切数据 + 清红点 + 重画 + 按需拉历史
  function selectPeer(type, id) {
    if (state.selectMode) exitSelectMode();
    if (!els.sharedLifeMask.classList.contains('hidden')) {
      closeSharedLife();
      closeProfile();
    }
    const isGroupTarget = type === 'group';
    if (!setActivePeer(type, id)) return;
    setChatSearchVisible(false);
    els.chatSearchInput.value = '';
    clearSearch();
    state.globalSearch.locateSeq += 1;
    clearGlobalSearch(true);
    const key = curConvKey();
    clearUnread(key);
    applyPeerIdentity();
    applyChatTheme();
    renderConvList();
    syncDesktopContactActive();
    renderAll(false);
    if (isGroupTarget) loadGroupDetail(state.peer.id);
    if (isGroupTarget) loadGroupFiles(state.peer.id);
    renderQuoteBar();
    if (!state.loaded[key]) {
      loadHistoryFor(key);
    } else {
      scrollToBottom(false);
    }
  }

  // 兼容旧调用点（全部走泛化后的 selectPeer）
  function selectCharacter(cid) {
    selectPeer('private', cid);
  }

  async function requestHistoryPage(key, count, beforeId = '') {
    const k = String(key);
    const params = { count };
    if (beforeId) params.before_id = beforeId;
    let resp;
    if (k.charAt(0) === 'g') {
      params.group_id = k.slice(1);
      resp = await call('get_group_msg_history', params, 20000);
    } else {
      params.user_id = Number(k);
      resp = await call('get_friend_msg_history', params, 20000);
    }
    const data = resp?.data || {};
    return {
      rows: Array.isArray(data.messages) ? data.messages : [],
      hasMore: data.has_more,
      nextBeforeId: data.next_before_id,
      hasNextBeforeId: Object.prototype.hasOwnProperty.call(data, 'next_before_id'),
    };
  }

  function applyHistoryPage(key, page) {
    const k = String(key);
    if (page.hasMore === false) state.hasMore[k] = false;
    else if (page.hasMore === true) state.hasMore[k] = true;
    if (page.hasNextBeforeId) {
      state.historyCursor[k] = String(page.nextBeforeId ?? '');
    }
  }

  async function loadHistoryFor(key, count = HISTORY_PAGE) {
    const k = String(key);
    if (state.historyLoading[k]) return false;
    const shouldScroll = k === curConvKey() && state.atBottom;
    state.historyLoading[k] = true;
    state.historyError[k] = '';
    if (k === curConvKey()) renderAll(false);
    let ok = false;
    try {
      const page = await requestHistoryPage(k, count);
      applyHistoryPage(k, page);
      mergeHistory(page.rows, k, { scroll: false, skipRender: true });
      state.loaded[k] = true;
      ok = true;
    } catch (e) {
      state.loaded[k] = false;
      state.historyError[k] = e?.message || '历史消息加载失败';
    } finally {
      state.historyLoading[k] = false;
      if (k === curConvKey()) {
        renderAll(false);
        if (ok && shouldScroll) scrollToBottom(false);
      }
    }
    return ok;
  }

  async function syncAllConversations() {
    const cur = curConvKey();
    const jobs = [];
    for (const c of state.characters) {
      const key = String(c.id);
      jobs.push(loadHistoryFor(key, key === cur ? HISTORY_PAGE : 40));
    }
    for (const g of state.groups) {
      const key = groupKey(g.group_id);
      jobs.push(loadHistoryFor(key, key === cur ? HISTORY_PAGE : 40));
    }
    await Promise.all(jobs);
    renderConvList();
  }

  // ---------------------------------------------------------- 事件
  function onEvent(ev, replay = false) {
    if (!ev || typeof ev !== 'object') return;
    const isReplay = replay || !!ev._replay;
    // 握手完成前一律暂存，包括服务端补发的 _replay 事件。否则回放会在
    // restorePeer / 历史合并之前进入另一份缓存，造成身份丢失和重复上屏。
    if (!state.ready) {
      state.liveBuffer.push(ev);
      return;
    }
    if (ev.post_type === 'message') {
      if (ev.message_type === 'group' || ev.group_id) {
        handleGroupIncoming(ev, isReplay);
      } else if (ev.message_type && ev.message_type !== 'private') {
        return;
      } else {
        handleIncoming(ev, isReplay);
      }
    } else if (ev.post_type === 'message_sent') {
      if (ev.message_type === 'group' || ev.group_id) handleGroupSent(ev, isReplay);
      else handleSent(ev, isReplay);
    } else if (ev.post_type === 'notice') {
      if (ev.notice_type === 'friend_recall' || ev.notice_type === 'group_recall') {
        handleRecall(ev);
      } else if (ev.notice_type === 'read_state') {
        handleReadState(ev);
      } else if (ev.notice_type === 'reply_status') {
        handleReplyStatus(ev);
      }
    } else if (ev.post_type === 'request') {
      handleGroupRequest(ev);
    }
  }

  function segsOf(ev) {
    return Array.isArray(ev?.message) ? ev.message : [];
  }

  function isStickerSeg(seg) {
    if (!seg || typeof seg !== 'object') return false;
    const d = seg.data || {};
    if (seg.type === 'mface' || seg.type === 'marketface') return true;
    return seg.type === 'image' && String(d.sub_type ?? '') === '1';
  }

  function imageUrlOf(seg) {
    const d = seg?.data || {};
    const candidates = [d.url, d.file, d.path, d.file_path];
    for (const c of candidates) {
      if (typeof c === 'string' && c) {
        if (c.startsWith('file://')) continue;
        return c;
      }
    }
    if (typeof d.base64 === 'string' && d.base64) return 'data:image/png;base64,' + d.base64;
    return '';
  }

  function segsToText(segs) {
    const parts = [];
    for (const seg of (segs || [])) {
      if (!seg || typeof seg !== 'object') continue;
      const d = seg.data || {};
      if (seg.type === 'text') parts.push(String(d.text || ''));
      else if (seg.type === 'image' || seg.type === 'mface' || seg.type === 'marketface') {
        parts.push(isStickerSeg(seg) ? '[表情包]' : '[图片]');
      } else if (seg.type === 'face') parts.push('[表情]');
      else if (seg.type === 'record') parts.push('[语音]');
      else if (seg.type === 'at') parts.push(atLabel(d.qq));
      else if (seg.type === 'reply') continue;
      else if (seg.type === 'json') {
        const card = parseShareCard(seg);
        parts.push(card ? `[分享] ${card.title}` : '[分享]');
      } else if (seg.type === 'forward') {
        parts.push(String((seg.data && (seg.data.summary || seg.data.title))
                          || '聊天记录'));
      }
    }
    return parts.join('');
  }

  // 「甩分享」卡片：vol 发的是 OneBot 的 json 段（内容是一段 QQ 卡片同构的
  // JSON）。解析出来就能画成可点卡片；解析不了就退回纯文本，不丢内容。
  function parseShareCard(seg) {
    const raw = seg && seg.data && seg.data.data;
    if (!raw) return null;
    try {
      const obj = typeof raw === 'string' ? JSON.parse(raw) : raw;
      const news = ((obj || {}).meta || {}).news || {};
      if (!news.jumpUrl && !news.title) return null;
      return {
        title: String(news.title || ''),
        desc: String(news.desc || ''),
        url: String(news.jumpUrl || ''),
        tag: String(news.tag || ''),
        preview: String(news.preview || ''),
      };
    } catch (e) { return null; }
  }

  // 合并转发（forward）段里内嵌的聊天记录：OneBot 把每条放在 data.content 里。
  // 有的实现只给 data.id（要再调 get_forward_msg 才拿得到），那种就只能退回提示。
  function forwardItemsOf(seg) {
    const d = (seg && seg.data) || {};
    const raw = d.content || d.messages || [];
    let list = raw;
    if (typeof raw === 'string') {
      try { list = JSON.parse(raw); } catch (e) { list = []; }
    }
    if (!Array.isArray(list)) return [];
    const out = [];
    for (const it of list) {
      if (!it || typeof it !== 'object') continue;
      const sender = it.sender || it.user_name || it.nickname || {};
      const name = typeof sender === 'string' ? sender
        : String(sender.card || sender.nickname || it.nickname || '某人');
      const body = it.content || it.message || it.text || '';
      let text = '';
      if (typeof body === 'string') text = body;
      else if (Array.isArray(body)) {
        text = body.map((s) => {
          if (!s || typeof s !== 'object') return '';
          if (s.type === 'text') return String((s.data || {}).text || '');
          if (s.type === 'image' || s.type === 'mface') return '[图片]';
          if (s.type === 'record') return '[语音]';
          return '';
        }).join('');
      }
      if (text) out.push({ name, text: text.replace(/\s+/g, ' ').slice(0, 60) });
    }
    return out;
  }

  // 从 get_forward_msg 的响应里取条目。兼容 data.messages[*]（Stapxs/NapCat）
  // 与 data.message[*].data（Lagrange）两种形态。
  function forwardItemsFromApi(data) {
    const d = (data && data.data) || data || {};
    let msgs = d.messages;
    if (!Array.isArray(msgs)) {
      msgs = Array.isArray(d.message)
        ? d.message.map((n) => (n && n.data) || {}) : [];
    }
    const out = [];
    for (const it of msgs) {
      if (!it || typeof it !== 'object') continue;
      const sender = it.sender || {};
      const name = String(sender.card || sender.nickname
                          || it.nickname || '某人');
      const body = it.content || it.message || '';
      let text = '';
      if (typeof body === 'string') text = body;
      else if (Array.isArray(body)) text = segsToText(body);
      if (text) out.push({ name, text: text.replace(/\s+/g, ' ').slice(0, 80) });
    }
    return out;
  }

  // QQ 那种展开的「聊天记录」列表
  function makeFwdBox(title, items) {
    const box = document.createElement('div');
    box.className = 'fwd-box';
    const head = document.createElement('div');
    head.className = 'fwd-head';
    head.textContent = title || '聊天记录';
    box.appendChild(head);
    for (const it of items.slice(0, 30)) {
      const line = document.createElement('div');
      line.className = 'fwd-line';
      const who = document.createElement('span');
      who.className = 'fwd-who';
      who.textContent = it.name;
      const tx = document.createElement('span');
      tx.className = 'fwd-text';
      tx.textContent = it.text;
      line.append(who, tx);
      box.appendChild(line);
    }
    return box;
  }

  function makeShareCard(card) {
    const box = document.createElement('a');
    box.className = 'share-card';
    box.href = card.url || '#';
    box.target = '_blank';
    box.rel = 'noreferrer noopener';
    const head = document.createElement('strong');
    head.textContent = card.title || '分享';
    box.appendChild(head);
    if (card.desc) {
      const p = document.createElement('p');
      p.textContent = card.desc;
      box.appendChild(p);
    }
    if (card.tag) {
      const src = document.createElement('span');
      src.className = 'share-src';
      src.textContent = card.tag;
      box.appendChild(src);
    }
    return box;
  }

  function previewOf(msg) {
    if (msg.recalled) return '消息已撤回';
    const t = (msg.text || '').replace(/\s+/g, ' ').trim();
    if (t) return t.length > 42 ? t.slice(0, 42) + '…' : t;
    return '[消息]';
  }

  // ---------------------------------------------------------- 消息模型
  function makeMsg({ dir, segs, text, ts, mid = '', status = 'sent',
                     displaySegs = null, sender = null, system = false,
                     replyTo = null, conversation = '', clientMsgId = '',
                     sendAction = '', sendParams = null, sendSegs = null,
                     replyStatus = '', replyReason = '' }) {
    const key = `m${++state.keySeq}`;
    const t = ts || nowSec();
    return {
      key, dir, segs: displaySegs || segs || [], text: text || '',
      ts: t, mid: String(mid || ''), midAliases: [], status, sender, system,
      conversation: String(conversation || ''),
      clientMsgId: String(clientMsgId || ''),
      sendAction: String(sendAction || ''),
      sendParams: sendParams ? { ...sendParams } : null,
      sendSegs: sendSegs || null,
      replyStatus: String(replyStatus || ''),
      replyReason: String(replyReason || ''),
      replyTo: replyTo || null,
    };
  }

  function messageMids(msg) {
    if (!msg) return [];
    return [...new Set([String(msg.mid || ''),
      ...(Array.isArray(msg.midAliases) ? msg.midAliases : []).map(String)]
      .filter(Boolean))];
  }

  function findMessageByMid(list, mid) {
    const target = String(mid || '');
    if (!target) return null;
    return list.find((m) => messageMids(m).includes(target)) || null;
  }

  function indexMessageMids(msg) {
    for (const mid of messageMids(msg)) state.byMid.set(mid, msg);
  }

  function rememberMidAlias(msg, mid) {
    const alias = String(mid || '');
    if (!msg || !alias || alias === String(msg.mid || '')) return;
    if (!Array.isArray(msg.midAliases)) msg.midAliases = [];
    if (!msg.midAliases.includes(alias)) msg.midAliases.push(alias);
  }

  const isPrivateHistoryMid = (mid) => /^h\d+(?:-(?:\d+|s\d+))?$/.test(String(mid || ''));
  const isPrivateLiveMid = (mid) => /^\d+$/.test(String(mid || ''));

  // 私聊实时事件曾经使用随机数字 ID，历史则使用 h<turn_id>。身份升级后仍
  // 保留旧 ID 别名，迟到的补发、引用定位和撤回才不会找不到原气泡。
  function mergeMessageIdentity(msg, mid) {
    const next = String(mid || '');
    if (!msg || !next || messageMids(msg).includes(next)) return false;
    const previous = String(msg.mid || '');
    if (isPrivateHistoryMid(next) && isPrivateLiveMid(previous)) {
      rememberMidAlias(msg, previous);
      msg.mid = next;
    } else if (isPrivateHistoryMid(previous) && isPrivateLiveMid(next)) {
      rememberMidAlias(msg, next);
    } else {
      rememberMidAlias(msg, previous);
      msg.mid = next;
    }
    return true;
  }

  // 只配对“一条历史 h… + 一条实时数字 ID”的文本消息，并且每条消息只能
  // 被消费一次。两条真实的同文消息因此仍然保留两条，绝不做全局同文过滤。
  function findPrivateHistoryCounterpart(list, msg) {
    const ids = messageMids(msg);
    const history = ids.some(isPrivateHistoryMid);
    const live = ids.some(isPrivateLiveMid);
    if (history === live) return null;
    const target = normText(msg.text);
    if (!target || !(msg.segs || []).every((s) => s?.type === 'text')) return null;
    const windowSec = msg.dir === 'in' ? 180 : 20;
    const ts = Number(msg.ts || 0);
    let best = null;
    let bestGap = Infinity;
    for (const candidate of list) {
      if (!candidate || candidate.key === msg.key || candidate.recalled ||
          candidate.dir !== msg.dir ||
          !(candidate.segs || []).every((s) => s?.type === 'text') ||
          normText(candidate.text) !== target) continue;
      const otherIds = messageMids(candidate);
      const otherHistory = otherIds.some(isPrivateHistoryMid);
      const otherLive = otherIds.some(isPrivateLiveMid);
      if (otherHistory === otherLive || otherHistory === history) continue;
      const gap = Math.abs(Number(candidate.ts || 0) - ts);
      if (gap > windowSec || gap >= bestGap) continue;
      best = candidate;
      bestGap = gap;
    }
    return best;
  }

  function findClientMessage(list, conversation, clientMsgId) {
    const cid = String(clientMsgId || '');
    const key = String(conversation || '');
    if (!cid || !key) return null;
    return list.find((m) => m.dir === 'out' &&
      String(m.conversation || '') === key &&
      String(m.clientMsgId || '') === cid) || null;
  }

  function markMessageSaved(msg, conversation, mid = '', clientMsgId = '') {
    if (!msg) return;
    const key = String(conversation || msg.conversation || '');
    if (clientMsgId && !msg.clientMsgId) msg.clientMsgId = String(clientMsgId);
    mergeMessageIdentity(msg, mid);
    msg.status = 'sent';
    if (key === curConvKey()) {
      indexMessageMids(msg);
      refreshRow(msg);
    }
  }

  function addMsg(msg, force = false) {
    if (!force && msg.mid && state.byMid.has(msg.mid)) return null;
    state.msgs.push(msg);
    indexMessageMids(msg);
    hideEmptyState();

    const ck = curConvKey();
    // 内存软上限：只裁窗口之外的最老部分（裁掉的还能「加载更早」翻回来）；
    // 用户翻上去看历史时（winStart 大于贴底值以外的区间被占用）不裁，
    // 免得抽走他正在看的内容。
    if (state.msgs.length > MEM_KEEP) {
      const ws0 = state.winStart[ck] || 0;
      if (ws0 > 0) {
        const drop = Math.min(state.msgs.length - MEM_KEEP, ws0);
        state.msgs.splice(0, drop);
        state.winStart[ck] = ws0 - drop;
        rebuildMidIndex();
      }
    }

    // ★ 乱序到达（服务端 time 比最后一条还早，回放/离线补发时常见）：
    //   排回时间序整屏重画，保证「右侧最下面那条」= 左侧预览引用的那条。
    const prev = state.msgs[state.msgs.length - 2];
    if (prev && Number(msg.ts || 0) < Number(prev.ts || 0)) {
      state.msgs.sort((a, b) => Number(a.ts || 0) - Number(b.ts || 0));
      state.lastTs = 0;
      renderAll(true);
    } else if (state.atBottom &&
               state.msgs.length - (state.winStart[ck] || 0) > RENDER_WINDOW * 2) {
      // 窗口贴底跟随：用户没往上翻而窗口长度涨到两倍，收紧回一屏 —
      // 不然一个会话挂一整天，DOM 还是会无限长下去
      state.winStart[ck] = Math.max(0, state.msgs.length - RENDER_WINDOW);
      renderAll(false);
    } else {
      appendRow(msg);
    }
    syncTypingIndicator();
    syncConvPreview();
    if (msg.dir === 'in') {
      const mobileAway = window.matchMedia('(max-width: 880px)').matches &&
        !els.appView.classList.contains('mobile-chat');
      const hidden = document.hidden || !state.atBottom || mobileAway;
      if (hidden) bumpUnread();
      else scrollToBottom(true);
    } else {
      scrollToBottom(true);
    }
    return msg;
  }

  // 历史消息和实时消息可能描述同一条：同一方向、同文本、时间相差 10 秒内
  function normText(s) {
    return String(s || '').replace(/\s+/g, '');
  }

  function coveredByExisting(m, windowSec = 20, list = state.msgs) {
    const target = normText(m.text);
    if (!target) return false;
    const near = list.filter((x) => x.dir === m.dir && x.text &&
      Math.abs((x.ts || 0) - (m.ts || 0)) <= windowSec);
    if (near.some((x) => normText(x.text) === target)) return true;
    const joined = near.map((x) => normText(x.text)).join('');
    if (joined.includes(target)) return true;
    return false;
  }

  // 时间桶索引：mergeHistory 逐条全表扫 coveredByExisting 是 O(n²)，
  // 历史量大时切会话明显慢。按 180 秒一桶建索引后，候选只剩 ±1 桶里的
  // 少数几条。判定规则和 coveredByExisting 完全一致（精确命中 + 拼接包含）。
  const BUCKET_SEC = 180;
  function buildTimeBuckets(list) {
    const buckets = new Map();
    for (const x of list) bucketAdd(buckets, x);
    return buckets;
  }
  function bucketAdd(buckets, m) {
    const t = normText(m.text);
    if (!t) return;
    const b = Math.floor(Number(m.ts || 0) / BUCKET_SEC);
    if (!buckets.has(b)) buckets.set(b, []);
    buckets.get(b).push({ t, ts: Number(m.ts || 0), dir: m.dir });
  }
  function coveredByBuckets(m, windowSec, buckets) {
    const target = normText(m.text);
    if (!target) return false;
    const ts = Number(m.ts || 0);
    const b0 = Math.floor((ts - windowSec) / BUCKET_SEC);
    const b1 = Math.floor((ts + windowSec) / BUCKET_SEC);
    const near = [];
    for (let b = b0; b <= b1; b++) {
      for (const e of (buckets.get(b) || [])) {
        if (e.dir === m.dir && Math.abs(e.ts - ts) <= windowSec) near.push(e);
      }
    }
    if (near.some((e) => e.t === target)) return true;
    const joined = near.map((e) => e.t).join('');
    return joined.includes(target);
  }

  // 合并历史（私聊 / 群聊都用）。key = 会话键（私聊为 String(id)，群聊为 "g"+群号）。
  // 方向判定：私聊按 sender 是否等于会话对象；群里按 sender 是否是「我」。
  function mergeHistory(history, key = curConvKey(), opts = {}) {
    const k = String(key);
    const isCurrent = k === curConvKey();
    const list = isCurrent ? state.msgs : listFor(k);
    const group = k.charAt(0) === 'g';
    const seen = new Set(list.map((m) => m.mid).filter(Boolean));
    const buckets = buildTimeBuckets(list);
    let added = 0;
    let changed = false;
    for (const raw of (history || [])) {
      const segs = Array.isArray(raw.message) ? raw.message : [];
      const text = segsToText(segs) || String(raw.raw_message || '');
      if (!text && !segs.length) continue;
      const senderId = String(raw.sender?.user_id ?? raw.user_id ?? '');
      const dir = group
        ? (isOwner(senderId) ? 'out' : 'in')
        : (Number(senderId) === Number(k) ? 'in' : 'out');
      const isSystem = group && String(raw.sender?.role || '') === 'system';
      const mid = String(raw.message_id || '');
      const cid = String(raw.client_msg_id || '');
      const byClient = findClientMessage(list, k, cid);
      const byMid = findMessageByMid(list, mid);
      const existing = byClient || byMid;
      if (existing) {
        if (cid && existing.clientMsgId !== cid) {
          existing.clientMsgId = cid;
          changed = true;
        }
        if (mergeMessageIdentity(existing, mid)) changed = true;
        if (existing.dir === 'out' && existing.status !== 'sent') {
          existing.status = 'sent';
          changed = true;
        }
        const rq = raw.reply;
        if (rq && (rq.text || rq.name)) {
          existing.replyTo = {
            name: String(rq.name || ''), text: String(rq.text || ''),
            message_id: String(rq.message_id || ''),
          };
          changed = true;
        }
        if (mid) seen.add(mid);
        continue;
      }
      const m = makeMsg({
        dir, segs, text: text || '[消息]',
        ts: Number(raw.time) || 0,
        mid, conversation: k, clientMsgId: cid,
        sender: group ? senderOf(raw) : null,
        system: isSystem,
      });
      const rq = raw.reply;
      if (rq && (rq.text || rq.name)) {
        m.replyTo = { name: String(rq.name || ''), text: String(rq.text || ''),
                      message_id: String(rq.message_id || '') };
      }
      const counterpart = group ? null : findPrivateHistoryCounterpart(list, m);
      if (counterpart) {
        if (mergeMessageIdentity(counterpart, mid)) changed = true;
        if (counterpart.dir === 'out' && counterpart.status !== 'sent') {
          counterpart.status = 'sent';
          changed = true;
        }
        if (m.replyTo) {
          counterpart.replyTo = m.replyTo;
          changed = true;
        }
        if (mid) seen.add(mid);
        continue;
      }
      // 只有缺少稳定 ID 的旧消息才按文本和时间兜底；不同 ID 的相同内容必须保留。
      const win = dir === 'in' ? 180 : 20;
      if (!mid && !cid && coveredByBuckets(m, win, buckets)) continue;
      list.push(m);
      bucketAdd(buckets, m);
      if (mid) seen.add(mid);
      added += 1;
    }
    if (!added && !changed) {
      syncConvPreview(k);
      if (!isCurrent) recomputeUnread(k);
      return 0;
    }
    if (added) list.sort((a, b) => (a.ts - b.ts));
    if (isCurrent) {
      rebuildMidIndex();
      if (!opts.skipRender) renderAll(false);
    }
    const last = list[list.length - 1];
    if (last) updateConvPreview(last, k);
    if (isCurrent) {
      markRead(k, last?.ts || 0);
      clearUnread(k);
      if (opts.scroll !== false) scrollToBottom(false);
    } else {
      recomputeUnread(k);
    }
    return added;
  }

  function handleIncoming(ev, replay = false) {
    const mid = String(ev.message_id || '');
    const peer = String(ev.user_id || ev.sender?.user_id || '');
    if (!peer) return;
    const segs = segsOf(ev);
    const text = segsToText(segs) || String(ev.raw_message || '');
    const msg = makeMsg({
      dir: 'in', segs, text: text || '[消息]',
      ts: Number(ev.time) || nowSec(), mid, conversation: peer,
      clientMsgId: String(ev.client_msg_id || ''),
      replyTo: replyInfoOf(ev),
    });
    const current = peer === curConvKey();
    const list = current ? state.msgs : listFor(peer);
    if (mid && (current ? state.byMid.has(mid) : findMessageByMid(list, mid))) return;
    const counterpart = findPrivateHistoryCounterpart(list, msg);
    if (counterpart) {
      const replyChanged = !!msg.replyTo && !counterpart.replyTo;
      if (replyChanged) counterpart.replyTo = msg.replyTo;
      const identityChanged = mergeMessageIdentity(counterpart, mid);
      if ((identityChanged || replyChanged) && current) {
        rebuildMidIndex();
        refreshRow(counterpart);
      }
      return;
    }

    if (!current) {
      if (replay && !mid && !msg.clientMsgId && coveredByExisting(msg, 180, list)) return;
      list.push(msg);
      list.sort((a, b) => a.ts - b.ts);
      syncConvPreview(peer);
      if (replay) recomputeUnread(peer);
      else {
        bumpUnread(peer);
        maybeNotifyIncoming(msg, peer);
      }
      return;
    }

    if (replay && !mid && !msg.clientMsgId && coveredByExisting(msg, 180)) return;
    const added = addMsg(msg);
    if (!replay && added) {
      queueAutoSpeech(msg);
      maybeNotifyIncoming(msg, peer);
    }
  }

  function handleSent(ev, replay = false) {
    const mid = String(ev.message_id || '');
    const peer = String(ev.user_id || ev.sender?.user_id || '');
    if (!peer) return;
    const key = peer;
    const segs = segsOf(ev);
    const text = segsToText(segs) || String(ev.raw_message || '') || '[消息]';
    const cid = String(ev.client_msg_id || '');
    const isRep = replay || !!ev._replay;
    const current = key === curConvKey();
    const list = current ? state.msgs : listFor(key);
    let recent = findClientMessage(list, key, cid);
    const formal = findMessageByMid(list, mid);
    if (!recent && formal) return;
    // 只有不带 client ID 的旧事件才使用文本和时间兜底。
    if (!recent && !cid) {
      recent = list.find((m) => m.dir === 'out' && !m.mid &&
        m.status === 'pending' && m.text === text && nowSec() - m.ts <= 20) || null;
    }
    if (recent) {
      const rq = replyInfoOf(ev);
      if (rq) recent.replyTo = rq;
      markMessageSaved(recent, key, mid, cid);
      return;
    }
    const m = makeMsg({
      dir: 'out', segs, text,
      ts: Number(ev.time) || nowSec(), mid,
      conversation: key, clientMsgId: cid,
      replyTo: replyInfoOf(ev),
    });
    const counterpart = findPrivateHistoryCounterpart(list, m);
    if (counterpart) {
      if (m.replyTo) counterpart.replyTo = m.replyTo;
      if (mergeMessageIdentity(counterpart, mid) && current) {
        rebuildMidIndex();
        refreshRow(counterpart);
      }
      return;
    }
    if (isRep && !mid && !cid && coveredByExisting(m, 20, list)) return;
    if (current) addMsg(m);
    else {
      list.push(m);
      list.sort((a, b) => a.ts - b.ts);
      syncConvPreview(key);
    }
  }

  function handleReplyStatus(ev) {
    const key = String(ev.conversation || ev.user_id || '');
    const cid = String(ev.client_msg_id || '');
    const status = String(ev.status || '');
    if (!key || key.charAt(0) === 'g' || !cid ||
        !['processing', 'replied', 'failed'].includes(status)) return;
    const terminalKey = key + '\n' + cid;
    if (state.replyTerminal.has(terminalKey)) {
      if (status !== 'processing') return;
      // 重新回应会复用原 client ID，由服务端显式开启新一轮状态。
      state.replyTerminal.delete(terminalKey);
    }
    const reason = String(ev.reason || '');
    const list = listFor(key);
    const msg = findClientMessage(list, key, cid);
    if (status === 'processing') {
      if (msg) {
        msg.replyStatus = 'processing';
        msg.replyReason = '';
      }
    } else {
      state.replyTerminal.set(terminalKey, {
        status, reason, time: Number(ev.time) || nowSec(),
      });
      const quietFailure = status === 'failed' &&
        (reason === 'intentional_silence' || reason === 'superseded' ||
         reason === 'cancelled');
      if (msg) {
        msg.replyStatus = status === 'failed' && !quietFailure ? 'failed' : '';
        msg.replyReason = msg.replyStatus ? reason : '';
      }
      if (status === 'failed' && !quietFailure) {
        toast('对方这次没能回复，请稍后再试');
      }
    }
    if (msg && key === curConvKey()) refreshRow(msg);
    if (key === curConvKey() && state.connected && !isGroup()) {
      els.chatSub.textContent = connectedPrivateSubtitle();
    }
    syncTypingIndicator();
    renderConvList();
  }

  // ---- 群消息：群里 user_id 是**发送者**（私聊里是会话对象），方向靠
  //      「发送者是不是我」判定，会话身份靠 group_id。
  // 事件里带的引用信息（服务端把我引用的那条也一并推过来了）
  function replyInfoOf(ev) {
    const r = ev && ev.reply;
    if (!r || (!r.text && !r.name)) return null;
    return { name: String(r.name || ''), text: String(r.text || ''),
             message_id: String(r.message_id || '') };
  }

  function groupMsgFromEvent(ev) {
    const segs = segsOf(ev);
    const text = segsToText(segs) || String(ev.raw_message || '');
    const sender = senderOf(ev);
    return makeMsg({
      dir: isOwner(sender.id) ? 'out' : 'in',
      segs, text: text || '[消息]',
      ts: Number(ev.time) || nowSec(),
      mid: String(ev.message_id || ''),
      conversation: groupKey(ev.group_id),
      clientMsgId: String(ev.client_msg_id || ''),
      sender,
      system: String(sender.role || '') === 'system',
      replyTo: replyInfoOf(ev),
    });
  }

  function handleGroupIncoming(ev, replay = false) {
    const gid = String(ev.group_id || '');
    if (!gid) return;
    const key = groupKey(gid);
    const msg = groupMsgFromEvent(ev);
    if (!groupKnown(gid)) {
      loadGroups().then(() => { renderConvList(); renderContactList(); });
    }
    if (msg.system) refreshGroupDetailSoon(gid);
    if (key !== curConvKey()) {
      const list = listFor(key);
      if (msg.mid && list.some((m) => m.mid === msg.mid)) return;
      if (replay && !msg.mid && !msg.clientMsgId && coveredByExisting(msg, 20, list)) return;
      list.push(msg);
      list.sort((a, b) => a.ts - b.ts);
      syncConvPreview(key);
      if (replay) recomputeUnread(key);
      else {
        bumpUnread(key);
        if (msg.dir === 'in') maybeNotifyIncoming(msg, key);
      }
      return;
    }
    if (msg.mid && state.byMid.has(msg.mid)) return;
    if (replay && !msg.mid && !msg.clientMsgId && coveredByExisting(msg, 20)) return;
    const added = addMsg(msg);
    if (!replay && added && msg.dir === 'in') maybeNotifyIncoming(msg, key);
  }

  function handleGroupSent(ev, replay = false) {
    const gid = String(ev.group_id || '');
    if (!gid) return;
    const key = groupKey(gid);
    const segs = segsOf(ev);
    const text = segsToText(segs) || String(ev.raw_message || '') || '[消息]';
    const mid = String(ev.message_id || '');
    const cid = String(ev.client_msg_id || '');
    const isRep = replay || !!ev._replay;
    const current = key === curConvKey();
    const list = current ? state.msgs : listFor(key);
    let recent = findClientMessage(list, key, cid);
    const formal = mid ? findMessageByMid(list, mid) : null;
    if (!recent && formal) return;
    if (!recent && !cid) {
      recent = list.find((m) => m.dir === 'out' && !m.mid &&
        m.status === 'pending' && m.text === text && nowSec() - m.ts <= 20) || null;
    }
    if (recent) {
      const rq = replyInfoOf(ev);
      if (rq && !recent.replyTo) recent.replyTo = rq;
      markMessageSaved(recent, key, mid, cid);
      return;
    }
    const m = makeMsg({
      dir: 'out', segs, text,
      ts: Number(ev.time) || nowSec(), mid,
      conversation: key, clientMsgId: cid, sender: senderOf(ev),
      replyTo: replyInfoOf(ev),
    });
    if (isRep && !mid && !cid && coveredByExisting(m, 20, list)) return;
    if (current) addMsg(m);
    else {
      list.push(m);
      list.sort((a, b) => a.ts - b.ts);
      syncConvPreview(key);
    }
  }

  // 入群申请（post_type=request）：刷新待审列表，群行亮红点
  function handleGroupRequest(ev) {
    const gid = String(ev.group_id || '');
    if (!gid) return;
    loadGroups().then(() => {
      renderConvList();
      if (isGroup() && String(state.peer.id) === gid) renderGroupSide();
    });
    const who = String(ev.user_id || (ev.comment && ev.comment.name) || '');
    toast(`有人申请加入群聊${who ? '：' + who : ''}`);
  }

  function handleReadState(ev) {
    const peer = String(ev.user_id || ev.target_id || '');
    const ts = Number(ev.read_time || ev.time || 0);
    if (!peer || !ts) return;
    const key = peer;
    if (ts <= Number(state.lastRead[key] || 0)) return;
    state.lastRead[key] = ts;
    saveLastRead();
    if (key !== curConvKey()) {
      recomputeUnread(key);
    } else {
      const meta = convMetaFor(key);
      meta.unread = 0;
      state.unread = totalUnread();
      updateBadges();
      updateDocTitle();
      renderConvList();
    }
  }

  function handleRecall(ev) {
    const mid = String(ev.message_id || '');
    if (!mid) return;
    if (state.speech.current?.mid === mid) stopSpeech({ clearCache: true });
    if (state.voicePlayback.current?.mid === mid) stopVoicePlayback();
    // 群消息撤回：按群会话键找
    const gid = String(ev.group_id || '');
    if (gid && mid.charAt(0) === 'g') {
      const key = groupKey(gid);
      const list = key === curConvKey() ? state.msgs : listFor(key);
      const gm = findMessageByMid(list, mid);
      if (!gm || gm.recalled) return;
      gm.recalled = gm.dir === 'out' ? 'me' : 'bot';
      state.selected.delete(gm.key);
      if (key === curConvKey()) {
        refreshRow(gm);
        updateMultiBar();
      }
      const glast = list[list.length - 1];
      if (glast) syncConvPreview(key);
      toast(gm.dir === 'out' ? '你撤回了一条消息' : '对方撤回了一条消息');
      return;
    }
    const peer = String(ev.user_id || ev.target_id || '');
    const key = peer;
    const isCurrent = !key || key === curConvKey();
    const list = isCurrent ? state.msgs : listFor(key);
    const msg = findMessageByMid(list, mid);
    if (!msg) return;
    if (msg.recalled) return;
    msg.recalled = msg.dir === 'out' ? 'me' : 'bot';
    state.selected.delete(msg.key);
    if (isCurrent) {
      refreshRow(msg);
      updateMultiBar();
      const last = list[list.length - 1];
      if (last && last.key === msg.key) syncConvPreview(key || curConvKey());
      toast(msg.dir === 'out' ? '你撤回了一条消息' : '对方撤回了一条消息');
    } else {
      const last = list[list.length - 1];
      if (last) syncConvPreview(key);
      recomputeUnread(key);
    }
  }

  // ---------------------------------------------------------- 渲染
  function rowElOf(msg) {
    return els.msgList.querySelector(`[data-key="${msg.key}"]`);
  }

  function revealLoadedMessage(target, key = curConvKey()) {
    if (!target || curConvKey() !== key) return null;
    const idx = state.msgs.indexOf(target);
    if (idx < 0) return null;
    if (idx < (state.winStart[key] || 0)) {
      state.winStart[key] = Math.max(0, idx - 20);
      renderAll(false);
    }
    const row = rowElOf(target);
    if (!row) return null;
    row.scrollIntoView({ block: 'center', behavior: 'smooth' });
    row.classList.add('flash');
    setTimeout(() => row.classList.remove('flash'), 1200);
    return row;
  }

  function resolveAsset(url, withAuth = true) {
    if (!url || typeof url !== 'string') return '';
    if (url.startsWith('data:') || url.startsWith('blob:')) return url;
    if (url.startsWith('base64://')) return 'data:image/png;base64,' + url.slice(9);
    if (url.startsWith('file://')) return '';
    try {
      let abs = new URL(url, location.origin);
      const localHosts = ['127.0.0.1', 'localhost', '0.0.0.0', '[::1]'];
      if (localHosts.includes(abs.hostname) && abs.origin !== location.origin) {
        abs = new URL(abs.pathname + abs.search + abs.hash, location.origin);
      }
      if (abs.origin === location.origin) {
        if (withAuth && state.token) abs.searchParams.set('access_token', state.token);
        else if (!withAuth) abs.searchParams.delete('access_token');
      }
      return abs.href;
    } catch (e) {
      return url;
    }
  }

  function appendTextWithLinks(parent, text) {
    const re = /(https?:\/\/[^\s<>"']+)/g;
    let last = 0;
    let m;
    while ((m = re.exec(text))) {
      if (m.index > last) parent.appendChild(document.createTextNode(text.slice(last, m.index)));
      const a = document.createElement('a');
      a.href = m[0];
      a.target = '_blank';
      a.rel = 'noreferrer noopener';
      a.textContent = m[0];
      parent.appendChild(a);
      last = m.index + m[0].length;
    }
    if (last < text.length) parent.appendChild(document.createTextNode(text.slice(last)));
  }

  const CAN_HOVER = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  function makeImage(url, sticker) {
    const img = document.createElement('img');
    // 聊天里的图片/表情包直接加载原图：GIF 自动播放。
    // 「悬停才动」只用于上面的表情选择面板（那里用首帧缩略图省性能）。
    img.src = resolveAsset(url);
    img.loading = 'lazy';
    img.alt = sticker ? '表情包' : '图片';
    img.tabIndex = 0;
    img.setAttribute('role', 'button');
    img.setAttribute('aria-label', sticker ? '查看表情包大图' : '查看图片大图');
    img.addEventListener('click', (e) => {
      e.stopPropagation();
      openLightbox(img.src);
    });
    img.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
      img.click();
    });
    img.addEventListener('error', () => {
      const box = document.createElement('span');
      box.className = 'face-chip';
      box.textContent = sticker ? '[表情包加载失败]' : '[图片加载失败]';
      img.replaceWith(box);
    });
    return img;
  }

  // ---------------------------------------------------------- 用户语音播放
  function audioMimeOf(value) {
    const mime = String(value || '').split(';', 1)[0].trim().toLowerCase();
    return /^audio\/[a-z0-9][a-z0-9.+-]*$/.test(mime) ? mime : 'audio/webm';
  }

  function recordUrlOf(seg) {
    const d = seg?.data || {};
    const mime = audioMimeOf(d.mime || d.mime_type);
    for (const source of [d.url, d.file]) {
      if (typeof source !== 'string' || !source) continue;
      if (source.startsWith('base64://')) {
        return `data:${mime};base64,${source.slice(9)}`;
      }
      if (source.toLowerCase().startsWith('data:audio/') || source.startsWith('blob:')) {
        return source;
      }
      if (source.startsWith('file://')) continue;
      if (/^https?:\/\//i.test(source) || source.startsWith('/')) {
        return resolveAsset(source);
      }
    }
    if (typeof d.base64 === 'string' && d.base64) {
      return `data:${mime};base64,${d.base64}`;
    }
    return '';
  }

  function formatVoiceDuration(seconds, clock = false) {
    const value = Math.max(0, Number(seconds) || 0);
    if (!clock) return `${value > 0 ? Math.max(1, Math.round(value)) : 0}″`;
    const total = Math.floor(value);
    return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
  }

  function updateVoicePlaybackButton(button, key) {
    const run = state.voicePlayback.current;
    const active = !!run && run.key === key;
    const playing = !!(active && run.audio && !run.audio.paused && !run.audio.ended);
    const failed = state.voicePlayback.failedKey === key;
    button.classList.toggle('is-playing', playing);
    button.classList.toggle('is-error', failed);
    button.setAttribute('aria-pressed', active ? 'true' : 'false');
    const label = playing ? '暂停语音' : failed ? '重试播放语音' : '播放语音';
    button.title = label;
    button.setAttribute('aria-label', label);
    button.querySelector('use')?.setAttribute('href', playing ? '#i-pause' : '#i-play');
  }

  function updateVoicePlaybackButtons() {
    els.msgList.querySelectorAll('.voice-message[data-voice-key]').forEach((button) => {
      updateVoicePlaybackButton(button, button.dataset.voiceKey);
    });
  }

  function cleanupVoicePlayback(run) {
    const audio = run?.audio;
    if (!audio) return;
    audio.onended = null;
    audio.onerror = null;
    audio.onplay = null;
    audio.onpause = null;
    try { audio.pause(); } catch (e) { /* ignore */ }
    audio.removeAttribute('src');
    try { audio.load(); } catch (e) { /* ignore */ }
    run.audio = null;
  }

  function stopVoicePlayback() {
    const run = state.voicePlayback.current;
    state.voicePlayback.current = null;
    state.voicePlayback.failedKey = '';
    cleanupVoicePlayback(run);
    updateVoicePlaybackButtons();
  }

  function finishVoicePlayback(run, error = null) {
    if (state.voicePlayback.current !== run) return;
    state.voicePlayback.current = null;
    cleanupVoicePlayback(run);
    state.voicePlayback.failedKey = error ? run.key : '';
    updateVoicePlaybackButtons();
    if (error && error.name !== 'AbortError') {
      toast(error.name === 'NotAllowedError'
        ? '浏览器阻止了播放，请再次点击语音'
        : '语音播放失败，请稍后重试');
    }
  }

  async function playVoiceRun(run) {
    try {
      await run.audio.play();
    } catch (e) {
      if (state.voicePlayback.current === run) finishVoicePlayback(run, e);
    }
  }

  function voiceCaptureActive() {
    return ['starting', 'recording', 'stopping'].includes(state.userVoice.phase);
  }

  function toggleVoicePlayback(msg, seg, key) {
    if (voiceCaptureActive()) {
      toast('请先完成或取消正在进行的录音');
      return;
    }
    const current = state.voicePlayback.current;
    if (current?.key === key && current.audio) {
      if (current.audio.paused) playVoiceRun(current);
      else current.audio.pause();
      return;
    }
    const url = recordUrlOf(seg);
    if (!url) {
      toast('这条语音没有可播放的音频');
      return;
    }
    stopSpeech({ clearQueue: true, clearCache: false });
    stopVoicePlayback();
    pauseVoicePreview();
    const run = { key, mid: String(msg.mid || ''), audio: new Audio() };
    run.audio.preload = 'auto';
    run.audio.src = url;
    run.audio.onended = () => finishVoicePlayback(run);
    run.audio.onerror = () => finishVoicePlayback(run, new Error('音频播放失败'));
    run.audio.onplay = () => {
      if (state.voicePlayback.current === run) updateVoicePlaybackButtons();
    };
    run.audio.onpause = () => {
      if (state.voicePlayback.current === run) updateVoicePlaybackButtons();
    };
    state.voicePlayback.current = run;
    updateVoicePlaybackButtons();
    playVoiceRun(run);
  }

  function makeVoiceMessage(msg, seg, key) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'voice-message';
    button.innerHTML = '<svg aria-hidden="true"><use href="#i-play"/></svg>' +
      '<span class="voice-wave" aria-hidden="true"><i></i><i></i><i></i><i></i></span>' +
      '<span class="voice-duration"></span>';
    button.querySelector('.voice-duration').textContent =
      formatVoiceDuration(seg.data?.duration);
    if (!recordUrlOf(seg)) {
      button.disabled = true;
      button.classList.add('is-error');
      button.title = '这条语音没有可播放的音频';
      button.setAttribute('aria-label', '语音不可用');
      return button;
    }
    button.dataset.voiceKey = key;
    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleVoicePlayback(msg, seg, key);
    });
    updateVoicePlaybackButton(button, key);
    return button;
  }

  function buildBubble(msg) {
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    const segs = (msg.segs || []).filter((s) => s && typeof s === 'object');
    const text = segs.filter((s) => s.type === 'text')
      .map((s) => String(s.data?.text || '')).join('');
    const media = segs.filter((s) => s.type === 'image' || s.type === 'mface' ||
      s.type === 'marketface');
    const hasSticker = media.some(isStickerSeg);
    const onlyMedia = media.length > 0 && !text.trim() &&
      segs.every((s) => s.type === 'image' || s.type === 'mface' ||
        s.type === 'marketface' || s.type === 'reply');

    if (onlyMedia) {
      if (hasSticker) {
        bubble.classList.add('sticker');
        for (const seg of media) {
          const url = imageUrlOf(seg);
          if (url) bubble.appendChild(makeImage(url, true));
          else {
            const chip = document.createElement('span');
            chip.className = 'face-chip';
            chip.textContent = '[表情包]';
            bubble.appendChild(chip);
          }
        }
      } else {
        bubble.classList.add('media');
        for (const seg of media) {
          const url = imageUrlOf(seg);
          if (url) bubble.appendChild(makeImage(url, false));
        }
      }
      if (!bubble.childNodes.length) bubble.textContent = '[图片]';
      applyBubbleDecor(bubble, chatThemeFor(themeKey(), msg.dir));
      return bubble;
    }

    for (const [segIndex, seg] of segs.entries()) {
      const d = seg.data || {};
      if (seg.type === 'text') {
        const raw = String(d.text || '');
        // ★ 文本里以「@某人 」开头的，前面已经画过 at 芯片了 —— 从这里削掉，
        //   否则会重复一遍（用户实测：气泡左边一块暗色芯片 + 又写一遍名字）
        let body = raw;
        const prev = bubble.lastElementChild;
        if (body && prev && prev.classList
            && prev.classList.contains('at-chip')) {
          // ★ 不依赖芯片的显示名（成员列表没加载时 atLabel 会退化成「@QQ号」，
          //   名字对不上就削不掉）—— 前面已经画过一个 at 芯片，这里把紧随其后的
          //   「@某某 」整段丢掉即可。
          body = body.replace(/^\s*@[^\s@]+[\s\u3000]*/, '');
          if (!body.trim() && raw.trim()) body = '';   // 只 @ 人没文字 → 什么都不留
        }
        if (body) appendTextWithLinks(bubble, body);
      } else if (seg.type === 'image' || seg.type === 'mface' || seg.type === 'marketface') {
        const url = imageUrlOf(seg);
        if (url) {
          bubble.appendChild(document.createElement('br'));
          bubble.appendChild(makeImage(url, isStickerSeg(seg)));
        }
      } else if (seg.type === 'face') {
        const chip = document.createElement('span');
        chip.className = 'face-chip';
        chip.textContent = '表情';
        bubble.appendChild(chip);
      } else if (seg.type === 'at') {
        const chip = document.createElement('span');
        chip.className = 'face-chip at-chip';
        // 尾巴留一个空格：@ 后面紧跟正文时不该粘成「@橘雪莉雪梨怎么…」
        chip.textContent = atLabel(d.qq) + ' ';
        bubble.appendChild(chip);
      } else if (seg.type === 'record') {
        if (bubble.childNodes.length) bubble.appendChild(document.createElement('br'));
        bubble.appendChild(makeVoiceMessage(msg, seg, `${msg.key}:record:${segIndex}`));
      } else if (seg.type === 'json') {
        // 「甩分享」卡片：解析得出来就画卡片。
        // ⚠️ 解析不出来时**不要**画「[聊天记录]」—— 那四个字对一条分享毫无
        // 信息量（用户实测：只看到「[聊天记录]」，完全不知道她发了什么）。
        // 退路优先取出里面能读的文字（标题/摘要/链接），实在没有才提示。
        const card = parseShareCard(seg);
        if (card) {
          if (bubble.childNodes.length) bubble.appendChild(document.createElement('br'));
          bubble.appendChild(makeShareCard(card));
        } else {
          const raw = String((seg.data && seg.data.data) || '');
          const chip = document.createElement('span');
          chip.className = 'face-chip';
          chip.textContent = raw
            ? ('[分享] ' + raw.replace(/[{}\[\]"]/g, ' ').trim().slice(0, 40))
            : '[分享]';
          bubble.appendChild(chip);
        }
      } else if (seg.type === 'forward') {
        // 合并转发：有内嵌内容就展开成列表（QQ 同款）；只有 id、内容在服务端
        // 时，画成**可点**的卡片 —— 点一下调 get_forward_msg 取回来再展开。
        // （原来是死占位「[聊天记录]」，用户实测「点不开」。）
        const title = String((seg.data && (seg.data.title || seg.data.summary))
                             || '聊天记录');
        const items = forwardItemsOf(seg);
        if (items.length) {
          if (bubble.childNodes.length) bubble.appendChild(document.createElement('br'));
          bubble.appendChild(makeFwdBox(title, items));
        } else {
          const fid = String((seg.data && (seg.data.id || seg.data.file)) || '');
          const chip = document.createElement('button');
          chip.type = 'button';
          chip.className = 'face-chip fwd-chip';
          chip.textContent = fid ? '聊天记录（点击查看）' : '聊天记录（内容不可用）';
          if (fid) {
            chip.addEventListener('click', async () => {
              if (chip.dataset.loaded) return;
              chip.textContent = '聊天记录（加载中…）';
              try {
                const res = await call('get_forward_msg', { id: fid }, 20000);
                const got = forwardItemsFromApi(res);
                if (got.length) {
                  chip.dataset.loaded = '1';
                  if (bubble.childNodes.length) {
                    bubble.appendChild(document.createElement('br'));
                  }
                  bubble.appendChild(makeFwdBox(title, got));
                  chip.remove();
                } else {
                  chip.textContent = '聊天记录（内容不可用）';
                }
              } catch (e) {
                chip.textContent = '聊天记录（加载失败，点我再试）';
              }
            });
          }
          bubble.appendChild(chip);
        }
      }
    }
    if (!bubble.childNodes.length) bubble.textContent = msg.text || '[消息]';
    applyBubbleDecor(bubble, chatThemeFor(themeKey(), msg.dir));
    return bubble;
  }

  function buildTypingRow() {
    const row = document.createElement('div');
    row.className = 'msg-row in typing-row';
    row.dataset.typing = '1';
    row.setAttribute('role', 'status');
    row.setAttribute('aria-label', `${state.bot.name || '对方'}正在输入`);

    const av = document.createElement('div');
    av.className = 'avatar bot-avatar';
    av.setAttribute('aria-hidden', 'true');
    fillAvatar(av, state.bot.name, state.bot.id);
    const body = document.createElement('div');
    body.className = 'msg-body';
    const bubble = document.createElement('div');
    bubble.className = 'bubble typing-bubble';
    bubble.setAttribute('aria-hidden', 'true');
    for (let i = 0; i < 3; i++) {
      const dot = document.createElement('i');
      bubble.appendChild(dot);
    }
    body.appendChild(bubble);
    row.append(av, body);
    return row;
  }

  function syncTypingIndicator() {
    const old = els.msgList.querySelector('.typing-row');
    const show = state.connected && state.ready && !isGroup() &&
      hasReplyProcessing(curConvKey());
    if (!show) {
      if (old) old.remove();
      return;
    }
    if (!old) els.msgList.appendChild(buildTypingRow());
  }

  function canGroupMessages(previous, msg) {
    if (!previous || !msg || previous.system || msg.system || previous.recalled || msg.recalled) return false;
    if (previous.dir !== msg.dir) return false;
    const gap = Number(msg.ts || 0) - Number(previous.ts || 0);
    if (gap < 0 || gap > 300) return false;
    if (!isGroup()) return true;
    const previousSender = previous.dir === 'out' ? 'me' : String(previous.sender?.id || '');
    const currentSender = msg.dir === 'out' ? 'me' : String(msg.sender?.id || '');
    return !!currentSender && previousSender === currentSender;
  }

  function buildRow(msg, previous = null) {
    const row = document.createElement('div');
    row.className = 'msg-row ' + (msg.dir === 'out' ? 'out' : 'in');
    if (msg.status === 'pending') row.classList.add('pending');
    if (msg.status === 'failed') row.classList.add('failed');
    if (msg.replyStatus === 'failed') row.classList.add('reply-failed');
    if (msg.selected || state.selected.has(msg.key)) row.classList.add('selected');
    row.dataset.key = msg.key;
    if (msg.mid) row.dataset.mid = msg.mid;

    // 群里的系统消息（入群/改名/公告/踢人…）：居中提示，不带头像
    if (msg.system) {
      row.className = 'msg-row system';
      const tip = document.createElement('div');
      tip.className = 'system-tip';
      tip.textContent = msg.text || '';
      row.appendChild(tip);
      row.addEventListener('contextmenu', (e) => e.preventDefault());
      return row;
    }

    if (msg.recalled) {
      row.classList.add('recalled');
      const tip = document.createElement('div');
      tip.className = 'recalled-tip';
      tip.textContent = msg.dir === 'out'
        ? '你撤回了一条消息' : '对方撤回了一条消息';
      row.appendChild(tip);
      row.addEventListener('contextmenu', (e) => e.preventDefault());
      return row;
    }

    if (canGroupMessages(previous, msg)) row.classList.add('grouped');

    const check = document.createElement('span');
    check.className = 'msg-check';
    check.setAttribute('role', 'checkbox');
    check.setAttribute('aria-checked',
      state.selected.has(msg.key) ? 'true' : 'false');
    check.tabIndex = 0;
    check.innerHTML = '<svg><use href="#i-check"/></svg>';
    check.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();
        toggleSelect(msg);
      }
    });

    // 头像：群里每条消息都带自己的发送者（头像 + 昵称 + 等级/角色）
    const sender = msg.sender;
    const av = document.createElement('div');
    av.className = 'avatar ' + (msg.dir === 'out' ? 'me-avatar' : 'bot-avatar');
    if (msg.dir === 'out') {
      av.title = state.me.name;
      fillAvatar(av, state.me.name, state.me.id, '我');
    } else if (sender && sender.id) {
      if (sender.role === 'system') {
        av.title = '系统';
        fillAvatar(av, '系统', '', '系');
      } else {
        av.title = sender.name;
        fillAvatar(av, sender.name, sender.id);
      }
    } else if (isGroup()) {
      // ★ 群里 sender 缺失时绝不能借用私聊角色 —— 那会把所有人都画成同一个
      //   头像（实测：刷新进群后所有人头像都变成星野，切换会话后才恢复）。
      av.title = '群成员';
      fillAvatar(av, '群成员', '', '群');
    } else {
      av.title = state.bot.name;
      fillAvatar(av, state.bot.name, state.bot.id);
    }
    // ★ 群里右键别人的头像 → 弹出成员菜单（第一项就是「@ ta」），
    //   和右侧成员列表同一套菜单。自己的头像不弹（不能 @ 自己）。
    av.addEventListener('contextmenu', (e) => {
      if (!isGroup() || state.selectMode) return;
      if (!sender || !sender.id) return;
      const sid = String(sender.id);
      if (sid === String(state.me.id) || isOwner(sid)
          || String(sender.role || '') === 'system') return;
      e.preventDefault();
      e.stopPropagation();
      openMemberMenu(e, { user_id: sid,
                          nickname: sender.name || sid,
                          role: sender.role || 'member' });
    });

    const body = document.createElement('div');
    body.className = 'msg-body';

    // 群聊里每条消息上方显示「昵称 + 等级/角色标签」（像 QQ 群）
    if (sender && !sender.system && (isGroup() || sender.id)) {
      const head = document.createElement('div');
      head.className = 'msg-sender';
      const nm = document.createElement('span');
      nm.className = 'ms-name';
      nm.textContent = sender.name;
      head.appendChild(nm);
      const badge = senderBadge(sender);
      if (badge) head.appendChild(badge);
      body.appendChild(head);
    }

    // 引用回复：气泡上方一条「昵称 + 摘要」的引用块（点了跳到原消息）
    if (msg.replyTo && (msg.replyTo.text || msg.replyTo.name)) {
      const ref = document.createElement('div');
      ref.className = 'quote-ref';
      const nm = document.createElement('span');
      nm.className = 'qr-name';
      nm.textContent = msg.replyTo.name || '消息';
      const tx = document.createElement('span');
      tx.className = 'qr-text';
      tx.textContent = msg.replyTo.text || '';
      ref.append(nm, tx);
      if (msg.replyTo.message_id) {
        ref.tabIndex = 0;
        ref.setAttribute('role', 'button');
        ref.setAttribute('aria-label', '定位到被引用的消息');
        ref.addEventListener('keydown', (event) => {
          if (event.key !== 'Enter' && event.key !== ' ') return;
          event.preventDefault();
          ref.click();
        });
        ref.addEventListener('click', async () => {
          const qmid = msg.replyTo.message_id;
          const k = curConvKey();
          let target = findMessageByMid(state.msgs, qmid);
          // 内存里没有：按服务端游标逐页查找；重复页不等于到底。
          for (let i = 0; !target && i < 6; i++) {
            if (state.hasMore[k] === false) break;
            if (state.historyLoading[k]) {
              toast('历史消息正在加载，请稍候再试');
              return;
            }
            toast('正在查找被引用的消息…');
            await loadEarlier();
            if (curConvKey() !== k) return;      // 查找期间切走了
            target = findMessageByMid(state.msgs, qmid);
            if (state.historyError[k]) break;
          }
          if (!target) {
            toast(state.historyError[k]
              ? '历史消息加载失败，请点顶部提示重试'
              : '被引用的消息太久远，找不到了');
            return;
          }
          if (!revealLoadedMessage(target, k)) {
            toast('被引用的消息不在当前加载范围');
          }
        });
      }
      body.appendChild(ref);
    }

    body.appendChild(buildBubble(msg));
    row.classList.toggle('has-tag', !!body.querySelector('.bubble-tag'));

    const meta = document.createElement('div');
    meta.className = 'msg-meta';
    const time = document.createElement('span');
    time.textContent = fmtClock(msg.ts);
    meta.appendChild(time);

    if (msg.status === 'pending') {
      const s = document.createElement('span');
      s.textContent = '发送中…';
      meta.appendChild(s);
    } else if (msg.status === 'failed') {
      const retry = document.createElement('button');
      retry.className = 'retry';
      retry.textContent = '发送失败，点此重试';
      retry.addEventListener('click', (e) => {
        e.stopPropagation();
        resend(msg);
      });
      meta.appendChild(retry);
    }
    if (msg.replyStatus === 'failed') {
      const replyError = document.createElement('span');
      replyError.className = 'reply-error';
      replyError.textContent = '对方未能回复';
      if (msg.replyReason) replyError.title = msg.replyReason;
      meta.appendChild(replyError);
      if (msg.clientMsgId) {
        const retryReply = document.createElement('button');
        retryReply.type = 'button';
        retryReply.className = 'retry reply-retry';
        retryReply.textContent = '重新回应';
        retryReply.addEventListener('click', async (e) => {
          e.stopPropagation();
          if (retryReply.disabled) return;
          retryReply.disabled = true;
          retryReply.textContent = '正在请求…';
          try {
            const res = await call('retry_reply', {
              conversation: msg.conversation || curConvKey(),
              client_msg_id: msg.clientMsgId,
            });
            if (!res?.data?.retrying) {
              toast(res?.data?.reason === 'already_processing'
                ? '对方正在回应，请稍等' : '暂时无法重新回应，请稍后重试');
              retryReply.disabled = false;
              retryReply.textContent = '重新回应';
            }
          } catch (error) {
            toast('重新回应失败，请稍后重试');
            retryReply.disabled = false;
            retryReply.textContent = '重新回应';
          }
        });
        meta.appendChild(retryReply);
      }
    }

    if (canSpeakMessage(msg)) {
      const speak = document.createElement('button');
      speak.type = 'button';
      speak.className = 'speech-btn';
      const speechKey = String(msg.key);
      speak.dataset.speechKey = speechKey;
      speak.innerHTML = '<svg aria-hidden="true"><use href="#i-megaphone"/></svg><span class="speech-label">朗读</span>';
      speak.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (state.speech.current?.key === speechKey) {
          stopSpeech({ clearCache: false });
        } else {
          playManualSpeech(msg);
        }
      });
      meta.appendChild(speak);
      updateSpeechButton(speak, msg.key);
    }

    body.appendChild(meta);
    row.append(check, av, body);
    // 多选模式下整行点击切换选中；捕获阶段拦掉图片预览/链接等子元素行为
    row.addEventListener('click', (e) => {
      if (Date.now() < state.suppressClickUntil) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      if (!state.selectMode) return;
      e.preventDefault();
      e.stopPropagation();
      toggleSelect(msg);
    }, true);

    // 触屏长按与桌面右键共用同一个消息菜单，不拦截正常滚动。
    let pressTimer = 0;
    let pressPoint = null;
    let longPressed = false;
    const cancelPress = () => {
      clearTimeout(pressTimer);
      pressTimer = 0;
      pressPoint = null;
    };
    row.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'mouse' || e.button !== 0 || state.selectMode) return;
      if (e.target.closest('a,button,input,textarea')) return;
      cancelPress();
      longPressed = false;
      pressPoint = { x: e.clientX, y: e.clientY };
      pressTimer = setTimeout(() => {
        if (!pressPoint || state.selectMode) return;
        const point = { ...pressPoint };
        longPressed = true;
        state.suppressClickUntil = Date.now() + 650;
        cancelPress();
        openCtx(point.x, point.y, msg);
      }, 520);
    });
    row.addEventListener('pointermove', (e) => {
      if (!pressPoint) return;
      if (Math.hypot(e.clientX - pressPoint.x, e.clientY - pressPoint.y) > 12) {
        cancelPress();
      }
    }, { passive: true });
    row.addEventListener('pointerup', cancelPress);
    row.addEventListener('pointercancel', cancelPress);
    row.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      if (state.selectMode) return;
      if (longPressed) { longPressed = false; return; }
      openCtx(e.clientX, e.clientY, msg);
    });
    return row;
  }

  // 群成员标签：群主 / 管理员 / LV 等级（QQ 群的味道）
  function senderBadge(sender) {
    if (!sender || sender.system) return null;
    const wrap = document.createElement('span');
    wrap.className = 'ms-badges';
    let any = false;
    const role = String(sender.role || '');
    if (role === 'owner' || role === 'admin') {
      const r = document.createElement('em');
      r.className = 'ms-role ' + role;
      r.textContent = role === 'owner' ? '群主' : '管理';
      wrap.appendChild(r);
      any = true;
    }
    const lv = Number(sender.level || 0);
    if (lv > 0) {
      const l = document.createElement('em');
      l.className = 'ms-lv';
      l.textContent = 'LV' + lv;
      wrap.appendChild(l);
      any = true;
    }
    return any ? wrap : null;
  }

  function appendSeparator(ts) {
    const sep = document.createElement('div');
    sep.className = 'day-sep';
    sep.textContent = fmtSep(ts);
    sep.dataset.sep = '1';
    els.msgList.appendChild(sep);
  }

  function appendRow(msg) {
    if (!msg.ts) msg.ts = nowSec();
    // 真实消息始终排在输入提示之前，提示不会干扰日期分隔与连续消息分组。
    els.msgList.querySelector('.typing-row')?.remove();
    const separated = !state.lastTs || msg.ts - state.lastTs > 300;
    if (separated) appendSeparator(msg.ts);
    state.lastTs = Math.max(state.lastTs || 0, msg.ts);
    const previousRow = separated ? null : els.msgList.lastElementChild;
    const previous = previousRow?.classList.contains('msg-row')
      ? state.msgs.find((item) => item.key === previousRow.dataset.key) : null;
    els.msgList.appendChild(buildRow(msg, previous));
  }

  function refreshRow(msg) {
    const old = rowElOf(msg);
    if (!old) return;
    const previousRow = old.previousElementSibling;
    const previous = previousRow?.classList.contains('msg-row')
      ? state.msgs.find((item) => item.key === previousRow.dataset.key) : null;
    const row = buildRow(msg, previous);
    old.replaceWith(row);
  }

  function renderAll(scrollBottom) {
    els.msgList.innerHTML = '';
    state.lastTs = 0;
    const k = curConvKey();
    // 渲染窗口：只画 winStart 之后的部分，更早的折叠进顶部「加载更早」条
    const start = Math.min(state.winStart[k] || 0, state.msgs.length);
    state.winStart[k] = start;
    const showEarlier = start > 0 || state.hasMore[k] !== false ||
      !!state.historyError[k] || !!state.historyLoading[k] || !state.loaded[k];
    if (showEarlier) els.msgList.appendChild(earlierBar());
    const showEmpty = !state.msgs.length && state.loaded[k] && state.hasMore[k] === false &&
      !state.historyLoading[k] && !state.historyError[k];
    if (showEmpty) {
      els.msgList.appendChild(els.emptyState);
      els.emptyState.classList.remove('hidden');
    } else {
      hideEmptyState();
      for (const m of state.msgs.slice(start)) appendRow(m);
    }
    syncTypingIndicator();
    if (scrollBottom) scrollToBottom(false);
  }

  // 「加载更早」提示条：内存里还有就先吃内存，吃完了再向服务端翻页
  function earlierBar() {
    const k = curConvKey();
    const start = state.winStart[k] || 0;
    const loading = state.historyLoading[k] || (!state.loaded[k] && !state.historyError[k]);
    const actionable = !loading && (state.historyError[k] || start > 0 || state.hasMore[k] !== false);
    const bar = document.createElement(actionable ? 'button' : 'div');
    bar.className = 'earlier-bar';
    if (actionable) bar.type = 'button';
    if (loading) {
      bar.textContent = '正在加载历史消息…';
    } else if (state.historyError[k]) {
      bar.classList.add('error');
      bar.textContent = '历史消息加载失败，点击重试';
      bar.title = state.historyError[k];
      bar.addEventListener('click', () => {
        if (!state.loaded[k]) loadHistoryFor(k);
        else loadEarlier();
      });
    } else if (start > 0 || state.hasMore[k] !== false) {
      bar.textContent = '查看更早的消息';
      bar.addEventListener('click', () => { loadEarlier(); });
    } else {
      bar.textContent = '没有更早的消息了';
    }
    return bar;
  }

  // 向上 prepend 老消息时保持视口不动：记下 scrollHeight，重画后补回差值
  function preserveScroll(fn) {
    const el = els.msgScroll;
    const oldH = el.scrollHeight;
    const oldTop = el.scrollTop;
    fn();
    requestAnimationFrame(() => {
      el.scrollTop = oldTop + Math.max(0, el.scrollHeight - oldH);
    });
  }

  // 加载更早一页。返回新合并条数；是否到底只看服务端 has_more。
  async function loadEarlier() {
    const k = curConvKey();
    if (state.historyLoading[k]) return 0;
    const start = state.winStart[k] || 0;
    // 1) 内存里还有更早的：先把窗口往上扩一屏，不麻烦服务端
    if (start > 0) {
      const reveal = Math.min(RENDER_WINDOW, start);
      state.winStart[k] = start - reveal;
      preserveScroll(() => renderAll(false));
      return reveal;
    }
    if (state.hasMore[k] === false) return 0;
    // 2) 内存见底了：使用服务端返回的稳定消息游标翻页。
    state.historyLoading[k] = true;
    state.historyError[k] = '';
    const bar = els.msgList.querySelector('.earlier-bar');
    if (bar) bar.textContent = '正在加载更早的消息…';
    let added = 0;
    try {
      const cursor = String(state.historyCursor[k] || '');
      const page = await requestHistoryPage(k, HISTORY_PAGE, cursor);
      applyHistoryPage(k, page);
      added = mergeHistory(page.rows, k, { scroll: false, skipRender: true });
    } catch (e) {
      state.historyError[k] = e?.message || '历史消息加载失败';
    } finally {
      state.historyLoading[k] = false;
      if (curConvKey() === k) {
        if (added > 0) preserveScroll(() => renderAll(false));
        else renderAll(false);
      }
    }
    return added;
  }

  function hideEmptyState() {
    if (els.emptyState && els.emptyState.parentNode) {
      els.emptyState.classList.add('hidden');
    }
  }

  // ★ 左侧列表预览的唯一真源 = 该会话里「真正最新的那条消息」。
  //   之前预览有三个写入方（服务端 get_recent_contact 的 lastMsg、
  //   历史合并后的最后一条、实时到达的那一条），彼此不核对 ——
  //   「历史没新增」时（重启/二次同步很常见）服务端的旧 lastMsg 会一直
  //   挂在左侧，于是左侧预览和右侧对话的最新消息对不上（实测 bug）。
  function syncConvPreview(key = curConvKey()) {
    const k = String(key);
    const list = k === curConvKey() ? state.msgs : listFor(k);
    const meta = convMetaFor(k);
    if (!list.length) {
      meta.preview = '';
      meta.ts = 0;
      renderConvList();
      return;
    }
    let last = list[0];
    for (const m of list) {
      if (Number(m.ts || 0) >= Number(last.ts || 0)) last = m;
    }
    // 群消息预览带上说话人（像 QQ：「小星：今晚吃啥」）
    const who = k.charAt(0) === 'g' && last.dir !== 'out' && last.sender
      ? last.sender.name + '：' : (last.dir === 'out' ? '我：' : '');
    meta.preview = who + previewOf(last);
    meta.ts = last.ts;
    renderConvList();
  }

  function updateConvPreview(_msg, key = curConvKey()) {
    syncConvPreview(key);        // 兼容旧调用点：一律重新推导
  }

  // ---------------------------------------------------------- 滚动 / 未读
  function isAtBottom() {
    const el = els.msgScroll;
    return el.scrollHeight - el.scrollTop - el.clientHeight < 90;
  }

  function scrollToBottom(smooth) {
    requestAnimationFrame(() => {
      els.msgScroll.scrollTo({
        top: els.msgScroll.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto',
      });
      state.atBottom = true;
      clearUnread();
    });
  }

  function bumpUnread(key = curConvKey()) {
    const meta = convMetaFor(key);
    meta.unread = (meta.unread || 0) + 1;
    state.unread = totalUnread();
    updateBadges();
    renderConvList();
    updateDocTitle();
  }

  function clearUnread(key = curConvKey()) {
    markRead(key, 0);
    const meta = convMetaFor(key);
    meta.unread = 0;
    state.unread = totalUnread();
    updateBadges();
    renderConvList();
    updateDocTitle();
  }

  function updateBadges() {
    const n = state.unread;
    const current = convMetaFor(curConvKey()).unread || 0;
    els.toBottomBadge.textContent = current > 99 ? '99+' : String(current);
    els.toBottomBadge.classList.toggle('hidden', current === 0);
    if (els.navBadge) {
      els.navBadge.textContent = n > 99 ? '99+' : String(n);
      els.navBadge.classList.toggle('hidden', n === 0);
    }
  }

  els.msgScroll.addEventListener('scroll', () => {
    state.atBottom = isAtBottom();
    els.toBottom.classList.toggle('hidden', state.atBottom);
    if (state.atBottom) clearUnread();
  }, { passive: true });

  els.toBottom.addEventListener('click', () => scrollToBottom(true));

  // ---------------------------------------------------------- 发送
  function autosize() {
    const ta = els.input;
    ta.style.height = 'auto';
    ta.style.height = Math.min(148, Math.max(44, ta.scrollHeight)) + 'px';
  }

  function updateSendBtn() {
    const disabled = !els.input.value.trim();
    els.sendBtn.disabled = disabled;
    els.composer.classList.toggle('has-text', !disabled || state.pendingMentions.length > 0);
  }

  function draftSummaryFor(key) {
    const draft = state.drafts[String(key || '')];
    return typeof draft === 'string' ? draft.trim().replace(/\s+/g, ' ') : '';
  }

  let draftListFrame = 0;
  function scheduleDraftListRender() {
    if (draftListFrame) return;
    draftListFrame = requestAnimationFrame(() => {
      draftListFrame = 0;
      renderConvList();
    });
  }

  function setDraft(key, value) {
    const k = String(key || '');
    if (!k || k === '0' || k === 'g0') return;
    const text = String(value || '');
    if (text) {
      if (state.drafts[k] === text) return;
      state.drafts[k] = text;
    } else {
      if (!Object.prototype.hasOwnProperty.call(state.drafts, k)) return;
      delete state.drafts[k];
    }
    try { localStorage.setItem(LS_CONV_DRAFTS, JSON.stringify(state.drafts)); }
    catch (e) { /* 本地存储不可用时仅保留本次会话草稿 */ }
    scheduleDraftListRender();
  }

  function saveCurrentDraft() {
    if (!state.draftKey) return;
    setDraft(state.draftKey, els.input.value);
  }

  function restoreCurrentDraft(key = curConvKey()) {
    const k = String(key);
    state.draftKey = k;
    els.input.value = typeof state.drafts[k] === 'string' ? state.drafts[k] : '';
    autosize();
    updateSendBtn();
  }

  function clearSentDraft(key, sentText) {
    const k = String(key);
    if (state.draftKey === k) {
      if (els.input.value !== sentText) return;
      els.input.value = '';
      autosize();
      updateSendBtn();
    } else if (state.drafts[k] !== sentText) {
      return;
    }
    setDraft(k, '');
  }

  els.input.addEventListener('input', () => {
    autosize();
    updateSendBtn();
    saveCurrentDraft();
  });

  els.input.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' || e.shiftKey || e.isComposing || e.keyCode === 229) return;
    // 手机端 Enter 只换行，始终保留明确的发送按钮；Ctrl / Command 均可用于桌面发送。
    if (window.matchMedia('(max-width: 880px)').matches) return;
    const modifier = e.ctrlKey || e.metaKey;
    const shouldSend = appearancePrefs.sendKey === 'enter' || modifier;
    if (!shouldSend) return;
    e.preventDefault();
    sendText();
  });

  els.sendBtn.addEventListener('click', sendText);

  function sendText() {
    const text = els.input.value;
    if (!text.trim() && !state.pendingMentions.length) return;
    const key = curConvKey();
    if (state.textSendPending.has(key)) {
      toast('这条消息正在发送，请稍候');
      return;
    }
    if (!state.connected) {
      toast('还没连上，稍等一下再发');
      return;
    }
    setDraft(key, text);
    // 群里 @ 的人转成 at 段一起发（后端靠 at 段判断「@ 了谁」）
    const segs = isGroup() ? composeSegs(text) : [{ type: 'text', data: { text } }];
    // 引用回复：reply 段放在最前面，后端据此把 reply_to 落库。
    // ★ 私聊也允许引用（QQ 私聊里同样能引用某条消息）——原来只在群里给这个入口。
    const quoted = (state.replyTo && state.replyTo.mid) ? state.replyTo : null;
    if (quoted) segs.unshift({ type: 'reply', data: { id: quoted.mid } });
    // ★ QQ 的群引用会**顺手 @ 被引用的那个人**（对方收到提醒、也才知道你在回他）。
    //   这里照做：没手动 @ 过同一个人时，自动补一个 at 段（排在 reply 段之后）。
    //   私聊不加 @（真人私聊不这么干）。
    if (quoted && isGroup()) {
      const tgt = quoteAtTarget(quoted);
      const already = segs.some((s) => s.type === 'at'
        && String(s.data && s.data.qq) === String(tgt && tgt.id));
      if (tgt && !already) {
        segs.splice(1, 0, { type: 'at', data: { qq: atQqOf(tgt.id) } });
      }
    }
    state.pendingMentions = [];
    clearQuote();
    state.textSendPending.add(key);
    doSend(segs, text, null, quoted, { key, text }).finally(() => {
      state.textSendPending.delete(key);
    });
    els.input.focus();
  }

  // 发送目标参数：私聊 → send_msg + user_id；群聊 → send_group_msg + group_id
  function sendTarget() {
    if (isGroup()) {
      return { action: 'send_group_msg', params: { group_id: state.peer.id } };
    }
    return {
      action: 'send_msg',
      params: { message_type: 'private', user_id: state.bot.id },
    };
  }

  function createClientMsgId() {
    if (window.crypto && typeof window.crypto.randomUUID === 'function') {
      return window.crypto.randomUUID();
    }
    const bytes = new Uint8Array(16);
    window.crypto.getRandomValues(bytes);
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-` +
      `${hex.slice(16, 20)}-${hex.slice(20)}`;
  }

  async function transmitMessage(msg, draft = null) {
    const key = String(msg.conversation || '');
    try {
      const res = await call(msg.sendAction, {
        ...msg.sendParams,
        message: msg.sendSegs,
        client_msg_id: msg.clientMsgId,
      }, 25000);
      if (!res || res.status !== 'ok') throw new Error(res?.wording || '发送失败');
      const mid = String(res?.data?.message_id || '');
      markMessageSaved(msg, key, mid, msg.clientMsgId);
      if (draft && draft.key === key) clearSentDraft(draft.key, draft.text);
      return true;
    } catch (e) {
      // 正式消息事件可能先于 ACK 到达；已确认保存后不能被迟到的失败回退。
      if (msg.mid && msg.status === 'sent') {
        if (draft && draft.key === key) clearSentDraft(draft.key, draft.text);
        return true;
      }
      msg.status = 'failed';
      if (key === curConvKey()) refreshRow(msg);
      toast('发送失败：' + (e?.message || e));
      return false;
    }
  }

  async function doSend(sendSegs, text, displaySegs = null, quoted = null, draft = null) {
    if (!state.connected) {
      toast('还没连上，稍等一下再发');
      return;
    }
    const t = sendTarget();
    const conversation = curConvKey();
    const msg = addMsg(makeMsg({
      dir: 'out', segs: sendSegs, displaySegs, sendSegs,
      text: text || segsToText(displaySegs || sendSegs),
      ts: nowSec(), status: 'pending', conversation,
      clientMsgId: createClientMsgId(),
      sendAction: t.action, sendParams: t.params,
      sender: isGroup()
        ? { id: String(state.me.id), name: state.me.name, role: 'owner',
            level: myGroupLevel() }
        : null,
      replyTo: quoted ? quoteLabelOf(quoted) : null,
    }));
    if (!msg) return;
    await transmitMessage(msg, draft);
  }

  async function resend(msg) {
    if (!msg || msg.status === 'pending') return;
    if (!msg.sendAction || !msg.sendParams || !msg.sendSegs || !msg.clientMsgId) {
      toast('这条消息缺少原发送信息，无法重试');
      return;
    }
    msg.status = 'pending';
    if (msg.conversation === curConvKey()) refreshRow(msg);
    const draft = (msg.sendSegs || []).some((s) => s?.type === 'text')
      ? { key: String(msg.conversation || ''), text: msg.text || '' }
      : null;
    const ok = await transmitMessage(msg, draft);
    if (ok) toast('已重新发送');
  }

  // ---------------------------------------------------------- 图片
  els.imageBtn.addEventListener('click', () => els.fileInput.click());
  els.fileInput.addEventListener('change', () => {
    const files = [...(els.fileInput.files || [])];
    els.fileInput.value = '';
    files.forEach(sendImageFile);
  });

  function readDataURL(file) {
    return new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = () => resolve(String(fr.result));
      fr.onerror = () => reject(new Error('读取文件失败'));
      fr.readAsDataURL(file);
    });
  }

  async function prepareImage(file) {
    if (file.type === 'image/gif' || file.size < 1_200_000) {
      return { dataUrl: await readDataURL(file), name: file.name || 'image.png' };
    }
    const bitmap = await createImageBitmap(file);
    const max = 1600;
    const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
    const w = Math.max(1, Math.round(bitmap.width * scale));
    const h = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(bitmap, 0, 0, w, h);
    if (bitmap.close) bitmap.close();
    const base = (file.name || 'image').replace(/\.[^.]+$/, '');
    return { dataUrl: canvas.toDataURL('image/jpeg', 0.86), name: base + '.jpg' };
  }

  async function sendImageFile(file) {
    if (!file || !file.type || !file.type.startsWith('image/')) return;
    try {
      const { dataUrl, name } = await prepareImage(file);
      const base64 = dataUrl.slice(dataUrl.indexOf(',') + 1);
      const sendSeg = {
        type: 'image',
        data: { file: 'base64://' + base64, file_name: name, sub_type: 0, summary: '[图片]' },
      };
      const showSeg = {
        type: 'image',
        data: { file: dataUrl, sub_type: 0, summary: '[图片]' },
      };
      await doSend([sendSeg], '[图片]', [showSeg]);
    } catch (e) {
      toast('图片发送失败：' + (e?.message || e));
    }
  }

  // ---------------------------------------------------------- 用户语音录制
  const VOICE_MAX_SECONDS = 60;

  // 按住说话：只在移动端（触摸）生效，桌面仍是点一下打开录音面板。
  let voiceHold = null;
  let voiceClickSuppressUntil = 0;

  function renderVoiceHoldBar() {
    const v = state.userVoice;
    const active = !!(voiceHold && v.phase === 'recording');
    els.voiceHoldBar.classList.toggle('hidden', !active);
    if (!active) return;
    els.voiceHoldBar.classList.toggle('is-canceling', !!voiceHold.canceled);
    els.voiceHoldText.textContent = voiceHold.canceled
      ? '松开取消' : '松开发送 · 上滑取消';
    els.voiceHoldTime.textContent = formatVoiceDuration(v.duration, true);
  }

  function renderVoiceRecorder() {
    const v = state.userVoice;
    const hold = !!(voiceHold && v.phase === 'recording');
    const visible = v.phase !== 'idle';
    const preview = v.phase === 'preview' || v.phase === 'sending';
    const stopping = v.phase === 'starting' || v.phase === 'recording' ||
      v.phase === 'stopping';
    const labels = {
      idle: '准备录音',
      starting: '正在请求麦克风权限…',
      recording: '正在录音',
      stopping: '正在整理录音…',
      preview: '试听，确认后发送',
      sending: '正在发送语音…',
    };
    els.voiceRecorder.classList.toggle('hidden', !visible || hold);
    els.composerBox.classList.toggle('hidden', visible && !hold);
    renderVoiceHoldBar();
    els.voiceRecorder.classList.toggle('is-recording', v.phase === 'recording');
    els.voiceStatus.textContent = labels[v.phase] || labels.idle;
    els.voiceTime.textContent = formatVoiceDuration(v.duration, true);
    els.voicePreview.classList.toggle('hidden', !preview);
    els.voiceStop.classList.toggle('hidden', !stopping);
    els.voiceStop.disabled = v.phase !== 'recording';
    els.voiceSend.classList.toggle('hidden', !preview);
    els.voiceSend.disabled = v.phase !== 'preview';
    els.voiceSend.querySelector('span').textContent =
      v.phase === 'sending' ? '发送中…' : '发送';
    els.voiceCancel.disabled = v.phase === 'sending';
    const cancelLabel = preview ? '丢弃语音' : '取消录音';
    els.voiceCancel.title = cancelLabel;
    els.voiceCancel.setAttribute('aria-label', cancelLabel);
  }

  function stopVoiceStream(stream) {
    for (const track of (stream?.getTracks?.() || [])) {
      try { track.stop(); } catch (e) { /* ignore */ }
    }
  }

  function pauseVoicePreview() {
    try { els.voicePreview.pause(); } catch (e) { /* ignore */ }
  }

  function resetVoiceRecorder() {
    const v = state.userVoice;
    v.seq += 1;
    clearInterval(v.timer);
    v.timer = 0;
    const recorder = v.recorder;
    v.recorder = null;
    if (recorder) {
      recorder.ondataavailable = null;
      recorder.onerror = null;
      recorder.onstop = null;
      if (recorder.state !== 'inactive') {
        try { recorder.stop(); } catch (e) { /* ignore */ }
      }
    }
    stopVoiceStream(v.stream);
    v.stream = null;
    pauseVoicePreview();
    els.voicePreview.removeAttribute('src');
    try { els.voicePreview.load(); } catch (e) { /* ignore */ }
    if (v.objectUrl) URL.revokeObjectURL(v.objectUrl);
    v.phase = 'idle';
    v.peer = '';
    v.chunks = [];
    v.startedAt = 0;
    v.duration = 0;
    v.blob = null;
    v.objectUrl = '';
    v.holdAutoStop = false;
    voiceHold = null;
    renderVoiceRecorder();
  }

  function voiceRecordingError(error) {
    const name = String(error?.name || '');
    if (!window.isSecureContext) {
      return '当前环境不能录音，请使用 HTTPS 或 localhost 打开';
    }
    if (name === 'NotAllowedError' || name === 'SecurityError') {
      return '没有获得麦克风权限，请在浏览器地址栏中允许后重试';
    }
    if (name === 'NotFoundError' || name === 'OverconstrainedError') {
      return '没有检测到可用麦克风';
    }
    if (name === 'NotReadableError') {
      return '麦克风正被其他应用占用，请关闭后重试';
    }
    return '录音失败：' + (error?.message || '请检查浏览器麦克风设置');
  }

  function preferredRecorderMime() {
    if (typeof MediaRecorder.isTypeSupported !== 'function') return '';
    const candidates = [
      'audio/webm;codecs=opus',
      'audio/ogg;codecs=opus',
      'audio/mp4',
      'audio/webm',
    ];
    return candidates.find((mime) => MediaRecorder.isTypeSupported(mime)) || '';
  }

  function finishVoiceRecording(seq) {
    const v = state.userVoice;
    if (v.seq !== seq || !['recording', 'stopping'].includes(v.phase)) return;
    clearInterval(v.timer);
    v.timer = 0;
    if (v.startedAt) {
      v.duration = Math.min(VOICE_MAX_SECONDS,
        Math.max(0, (Date.now() - v.startedAt) / 1000));
    }
    stopVoiceStream(v.stream);
    v.stream = null;
    const recorder = v.recorder;
    v.recorder = null;
    const type = recorder?.mimeType || v.chunks.find((part) => part.type)?.type || 'audio/webm';
    const blob = new Blob(v.chunks, { type });
    v.chunks = [];
    if (!blob.size) {
      resetVoiceRecorder();
      toast('没有录到声音，请重试');
      return;
    }
    v.blob = blob;
    v.objectUrl = URL.createObjectURL(blob);
    v.phase = 'preview';
    els.voicePreview.src = v.objectUrl;
    renderVoiceRecorder();
  }

  function stopVoiceRecording(auto = false) {
    const v = state.userVoice;
    if (v.phase !== 'recording') return;
    v.phase = 'stopping';
    v.duration = Math.min(VOICE_MAX_SECONDS,
      Math.max(0, (Date.now() - v.startedAt) / 1000));
    clearInterval(v.timer);
    v.timer = 0;
    stopVoiceStream(v.stream);
    v.stream = null;
    renderVoiceRecorder();
    if (auto) toast(`已录满 ${VOICE_MAX_SECONDS} 秒，自动完成`);
    try {
      // 若轨道结束已令 recorder 停止，最终 dataavailable / stop 事件会依次到达；
      // 不在此处提前合成 Blob，免得漏掉最后一个音频块。
      if (v.recorder.state !== 'inactive') v.recorder.stop();
    } catch (e) {
      resetVoiceRecorder();
      toast('录音结束失败，请重试');
    }
  }

  async function startVoiceRecording() {
    const v = state.userVoice;
    if (v.phase !== 'idle' || isGroup()) return;
    if (!window.isSecureContext) {
      toast('当前环境不能录音，请使用 HTTPS 或 localhost 打开');
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      toast('当前浏览器不支持录音，请使用新版 Chrome、Edge 或 Safari');
      return;
    }
    stopSpeech({ clearQueue: true, clearCache: false });
    stopVoicePlayback();
    pauseVoicePreview();
    hidePanels();
    const seq = ++v.seq;
    v.phase = 'starting';
    v.peer = curConvKey();
    v.duration = 0;
    v.holdAutoStop = false;
    renderVoiceRecorder();
    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });
    } catch (e) {
      if (v.seq !== seq) return;
      resetVoiceRecorder();
      toast(voiceRecordingError(e));
      return;
    }
    if (v.seq !== seq) {
      stopVoiceStream(stream);
      return;
    }
    v.stream = stream;
    try {
      const mime = preferredRecorderMime();
      v.recorder = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
    } catch (e) {
      resetVoiceRecorder();
      toast(voiceRecordingError(e));
      return;
    }
    v.chunks = [];
    v.recorder.ondataavailable = (event) => {
      if (v.seq === seq && event.data?.size) v.chunks.push(event.data);
    };
    v.recorder.onerror = (event) => {
      if (v.seq !== seq) return;
      const error = event.error || new Error('录音被中断');
      resetVoiceRecorder();
      toast(voiceRecordingError(error));
    };
    v.recorder.onstop = () => finishVoiceRecording(seq);
    try {
      v.recorder.start(250);
    } catch (e) {
      resetVoiceRecorder();
      toast(voiceRecordingError(e));
      return;
    }
    v.startedAt = Date.now();
    v.phase = 'recording';
    renderVoiceRecorder();
    // 用户在申请麦克风权限期间就松手了：拿到录音流后立刻收尾，避免一直录下去。
    if (v.holdAutoStop) {
      v.holdAutoStop = false;
      stopVoiceRecording();
      return;
    }
    v.timer = setInterval(() => {
      if (v.seq !== seq || v.phase !== 'recording') return;
      const elapsed = Math.max(0, (Date.now() - v.startedAt) / 1000);
      v.duration = Math.min(VOICE_MAX_SECONDS, elapsed);
      els.voiceTime.textContent = formatVoiceDuration(v.duration, true);
      if (voiceHold) els.voiceHoldTime.textContent = formatVoiceDuration(v.duration, true);
      if (elapsed >= VOICE_MAX_SECONDS) stopVoiceRecording(true);
    }, 200);
  }

  async function sendVoiceRecording() {
    const v = state.userVoice;
    if (v.phase !== 'preview' || !v.blob) return;
    if (!state.connected) {
      toast('还没连上，语音已保留，稍后再发送');
      return;
    }
    const seq = v.seq;
    const peer = v.peer;
    const blob = v.blob;
    v.phase = 'sending';
    pauseVoicePreview();
    renderVoiceRecorder();
    try {
      const dataUrl = await readDataURL(blob);
      if (v.seq !== seq) return;
      if (curConvKey() !== peer || isGroup()) {
        resetVoiceRecorder();
        toast('会话已切换，这条语音未发送');
        return;
      }
      if (!state.connected) {
        v.phase = 'preview';
        renderVoiceRecorder();
        toast('连接已断开，语音已保留，稍后再发送');
        return;
      }
      const comma = dataUrl.indexOf(',');
      if (comma < 0) throw new Error('无法读取录音内容');
      const mime = audioMimeOf(blob.type);
      const duration = Math.round(Math.max(0, v.duration) * 1000) / 1000;
      const sendSeg = {
        type: 'record',
        data: {
          file: 'base64://' + dataUrl.slice(comma + 1), mime, duration, summary: '[语音]',
        },
      };
      const showSeg = {
        type: 'record',
        data: { file: dataUrl, mime, duration, summary: '[语音]' },
      };
      await doSend([sendSeg], '[语音]', [showSeg]);
      if (v.seq === seq) resetVoiceRecorder();
    } catch (e) {
      if (v.seq !== seq) return;
      v.phase = 'preview';
      renderVoiceRecorder();
      toast('语音发送失败：' + (e?.message || e));
    }
  }

  // 移动端「按住说话」：按下即录，松手结束进入试听；上滑超过 56px 取消。
  const VOICE_HOLD_CANCEL_PX = 56;

  function voiceHoldEligible(e) {
    return e.pointerType !== 'mouse' &&
      window.matchMedia('(max-width: 880px)').matches;
  }

  function finishVoiceHold(canceled) {
    const hold = voiceHold;
    if (!hold) return;
    voiceHold = null;
    try { els.voiceBtn.releasePointerCapture(hold.pointerId); } catch (e) { /* ignore */ }
    voiceClickSuppressUntil = Date.now() + 500;
    const v = state.userVoice;
    if (hold.canceled || canceled) {
      resetVoiceRecorder();
      toast('已取消录音');
      return;
    }
    const pressedMs = Date.now() - (hold.startedAt || Date.now());
    // 轻点（不是按住）→ 打开原来的录音面板继续录，避免「刚点一下就提示太短」。
    if (pressedMs < 350) {
      v.holdAutoStop = false;
      renderVoiceRecorder();
      return;
    }
    if (v.phase === 'starting') {
      v.holdAutoStop = true;
      renderVoiceRecorder();
      return;
    }
    if (v.phase !== 'recording') return;
    if (Date.now() - (v.startedAt || Date.now()) < 800) {
      resetVoiceRecorder();
      toast('说话时间太短，请按住再说');
      return;
    }
    stopVoiceRecording();
  }

  els.voiceBtn.addEventListener('pointerdown', (e) => {
    if (!voiceHoldEligible(e)) return;
    if (state.userVoice.phase !== 'idle' || isGroup()) return;
    e.preventDefault();
    voiceHold = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      startedAt: Date.now(),
      canceled: false,
    };
    voiceClickSuppressUntil = Date.now() + 900;
    try { els.voiceBtn.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    startVoiceRecording();
  });

  els.voiceBtn.addEventListener('pointermove', (e) => {
    if (!voiceHold || e.pointerId !== voiceHold.pointerId) return;
    const canceled = e.clientY - voiceHold.startY < -VOICE_HOLD_CANCEL_PX;
    if (canceled === voiceHold.canceled) return;
    voiceHold.canceled = canceled;
    if (canceled && navigator.vibrate) {
      try { navigator.vibrate(12); } catch (err) { /* ignore */ }
    }
    renderVoiceHoldBar();
  });

  els.voiceBtn.addEventListener('pointerup', (e) => {
    if (!voiceHold || e.pointerId !== voiceHold.pointerId) return;
    finishVoiceHold(false);
  });

  els.voiceBtn.addEventListener('pointercancel', (e) => {
    if (!voiceHold || e.pointerId !== voiceHold.pointerId) return;
    finishVoiceHold(true);
  });

  els.voiceBtn.addEventListener('click', () => {
    if (Date.now() < voiceClickSuppressUntil) return;
    startVoiceRecording();
  });
  els.voiceBtn.addEventListener('contextmenu', (e) => {
    if (voiceHold) e.preventDefault();
  });
  els.voiceCancel.addEventListener('click', resetVoiceRecorder);
  els.voiceStop.addEventListener('click', () => stopVoiceRecording());
  els.voiceSend.addEventListener('click', sendVoiceRecording);
  els.voicePreview.addEventListener('play', () => {
    stopSpeech({ clearQueue: true, clearCache: false });
    stopVoicePlayback();
  });

  function syncVoiceHoldAffordance() {
    const mobile = window.matchMedia('(max-width: 880px)').matches;
    els.voiceBtn.title = mobile ? '按住说话' : '语音';
    els.voiceBtn.setAttribute('aria-label', mobile ? '按住说话' : '录制语音');
  }
  syncVoiceHoldAffordance();

  els.input.addEventListener('paste', (e) => {
    const items = [...(e.clipboardData?.items || [])];
    const files = items.filter((it) => it.type.startsWith('image/'))
      .map((it) => it.getAsFile()).filter(Boolean);
    if (files.length) {
      e.preventDefault();
      files.forEach(sendImageFile);
    }
  });

  function hasFiles(e) {
    const types = e.dataTransfer?.types || [];
    return [...types].includes('Files');
  }
  els.chatPane.addEventListener('dragenter', (e) => {
    if (!hasFiles(e)) return;
    e.preventDefault();
    state.dragDepth += 1;
    els.dropMask.classList.remove('hidden');
  });
  els.chatPane.addEventListener('dragover', (e) => {
    if (hasFiles(e)) e.preventDefault();
  });
  els.chatPane.addEventListener('dragleave', (e) => {
    if (!hasFiles(e)) return;
    state.dragDepth = Math.max(0, state.dragDepth - 1);
    if (state.dragDepth === 0) els.dropMask.classList.add('hidden');
  });
  els.chatPane.addEventListener('drop', (e) => {
    if (!hasFiles(e)) return;
    e.preventDefault();
    state.dragDepth = 0;
    els.dropMask.classList.add('hidden');
    const files = [...(e.dataTransfer?.files || [])];
    files.filter((f) => f.type.startsWith('image/')).forEach(sendImageFile);
  });

  // ---------------------------------------------------------- 表情
  const EMOJI = {
    '常用': ['😀','😃','😄','😁','😆','😅','😂','🤣','🙂','🙃','😉','😊','😇','🥰','😍','🤩','😘','😗','😚','😙','😋','😛','😜','🤪','😝','🤗','🤭','🤫','🤔','😐','😑','😶','🙄','😏','😒','😞','😔','😟','😕','🙁','☹️','😣','😖','😫','😩','🥺','😢','😭','😤','😠','😡','🤬','🤯','😳','🥵','🥶','😱','😨','😰','😥','😓','','😴','🥱'],
    '手势': ['👍','👎','👌','✌️','🤞','🤟','🤘','🤙','👈','👉','👆','👇','☝️','✋','🤚','🖐️','🖖','👋','🤝','🙏','💪','👏','🙌','👐','🤲'],
    '爱心': ['❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💔','❣️','💕','💞','💓','💗','💖','💘','💝','💟','♥️'],
    '动物': ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐷','🐸','🐵','🐔','🐧','🐦','🐤','🦄','🐝','🦋','🐢','🐬','🐳','🐙','🦐','🦀'],
    '食物': ['🍎','🍊','🍋','🍌','🍉','🍇','🍓','🍒','🍑','🥭','🍍','🥥','🥝','🍅','🥑','🍞','🥐','🥨','🧀','🍔','🍟','🍕','🌭','🍿','🍩','🍪','🎂','🍰','🧁','🍫','🍬','🍭','☕','🍵','🧋','🍺'],
    '其他': ['⭐','🌟','✨','⚡','🔥','💥','💫','🌈','☀️','🌙','⛅','☁️','🌧️','❄️','🎉','🎊','🎁','🎈','🎵','🎶','💤','💦','💨','🍀','🌸','🌻','🌷','🌹'],
  };
  const EMOJI_TABS = Object.keys(EMOJI);

  function renderEmoji() {
    els.emojiTabs.innerHTML = '';
    EMOJI_TABS.forEach((name, i) => {
      const b = document.createElement('button');
      b.className = 'tab' + (i === state.emojiCat ? ' active' : '');
      b.textContent = name;
      b.addEventListener('click', () => {
        state.emojiCat = i;
        renderEmoji();
      });
      els.emojiTabs.appendChild(b);
    });

    els.emojiGrid.innerHTML = '';
    for (const emoji of EMOJI[EMOJI_TABS[state.emojiCat]]) {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = emoji;
      b.title = emoji;
      b.addEventListener('click', () => {
        insertAtCursor(emoji);
      });
      els.emojiGrid.appendChild(b);
    }
  }

  function insertAtCursor(text) {
    const ta = els.input;
    const start = ta.selectionStart ?? ta.value.length;
    const end = ta.selectionEnd ?? start;
    ta.value = ta.value.slice(0, start) + text + ta.value.slice(end);
    const pos = start + text.length;
    ta.focus();
    try { ta.setSelectionRange(pos, pos); } catch (e) { /* ignore */ }
    autosize();
    updateSendBtn();
    saveCurrentDraft();
  }

  // ---------------------------------------------------------- 表情包
  async function apiFetch(url, options = {}) {
    const headers = new Headers(options.headers || {});
    let sameOrigin = false;
    try { sameOrigin = new URL(url, location.origin).origin === location.origin; }
    catch (e) { /* 非标准地址不附带本地访问令牌 */ }
    if (state.token && sameOrigin) headers.set('Authorization', 'Bearer ' + state.token);
    return fetch(url, { ...options, headers });
  }

  // ---------------------------------------------------------- 角色语音
  function normalizeVoice(value) {
    const raw = value && typeof value === 'object' ? value : {};
    const speed = Number(raw.speed);
    return {
      enabled: raw.enabled === true,
      auto: raw.auto === true,
      voice_id: String(raw.voice_id || ''),
      speed: Number.isFinite(speed) ? Math.max(0.5, Math.min(2, speed)) : 1,
    };
  }

  async function loadVoiceConfig(peerId, generation = null) {
    const id = String(peerId || '');
    if (!id || id === '0') return null;
    try {
      const res = await apiFetch(
        `/api/character-traits?peer_id=${encodeURIComponent(id)}`,
        { cache: 'no-store' });
      const data = await res.json().catch(() => ({}));
      if (generation !== null && generation !== state.wsGeneration) return null;
      if (!res.ok || !data.ok) return null;
      const voice = normalizeVoice(data.voice);
      state.voiceConfigs[id] = voice;
      return voice;
    } catch (e) { return null; }
  }

  async function loadVoiceConfigs(generation = null) {
    await Promise.all(state.characters.map((c) => loadVoiceConfig(c.id, generation)));
  }

  function speechTextFor(msg) {
    if (!msg || msg.dir !== 'in' || msg.recalled || msg.system) return '';
    const segs = Array.isArray(msg.segs) ? msg.segs : [];
    const text = segs.length
      ? segs.filter((s) => s?.type === 'text')
          .map((s) => String(s.data?.text || '')).join('')
      : String(msg.text || '');
    return text.replace(/\u0000/g, '').trim();
  }

  function canSpeakMessage(msg) {
    if (isGroup() || !speechTextFor(msg)) return false;
    return state.voiceConfigs[String(state.bot.id)]?.enabled === true;
  }

  function updateSpeechButton(button, key) {
    const run = state.speech.current;
    const active = run && run.key === key;
    const loading = active && run.phase === 'loading';
    const playing = active && run.phase === 'playing';
    const failed = !active && state.speech.failedKey === key;
    button.classList.toggle('is-loading', !!loading);
    button.classList.toggle('is-playing', !!playing);
    button.classList.toggle('is-error', !!failed);
    button.setAttribute('aria-pressed', active ? 'true' : 'false');
    const label = loading ? '取消合成' : playing ? '停止' : failed ? '重试朗读' : '朗读';
    button.querySelector('.speech-label').textContent = label;
    button.title = label;
    button.setAttribute('aria-label', label + '这条消息');
    button.closest('.msg-row')?.classList.toggle('speech-active', !!active);
  }

  function updateSpeechButtons() {
    els.msgList.querySelectorAll('.speech-btn[data-speech-key]').forEach((button) => {
      updateSpeechButton(button, button.dataset.speechKey);
    });
  }

  function clearSpeechFailure() {
    clearTimeout(state.speech.failureTimer);
    state.speech.failureTimer = 0;
    state.speech.failedKey = '';
  }

  function setSpeechFailure(key) {
    clearSpeechFailure();
    state.speech.failedKey = key;
    updateSpeechButtons();
    state.speech.failureTimer = setTimeout(() => {
      if (state.speech.failedKey !== key) return;
      state.speech.failedKey = '';
      state.speech.failureTimer = 0;
      updateSpeechButtons();
    }, 5000);
  }

  function clearSpeechCache() {
    state.speech.cache = null;
  }

  function cleanupSpeechRun(run, abort) {
    if (!run) return;
    if (abort) {
      try { run.controller?.abort(); } catch (e) { /* ignore */ }
    }
    if (run.audio) {
      run.audio.onended = null;
      run.audio.onerror = null;
      try { run.audio.pause(); } catch (e) { /* ignore */ }
      run.audio.removeAttribute('src');
      try { run.audio.load(); } catch (e) { /* ignore */ }
      run.audio = null;
    }
    if (run.objectUrl) {
      URL.revokeObjectURL(run.objectUrl);
      run.objectUrl = '';
    }
  }

  function stopSpeech({ clearQueue = true, clearCache = false } = {}) {
    state.speech.seq += 1;
    if (clearQueue) state.speech.queue.length = 0;
    const run = state.speech.current;
    state.speech.current = null;
    cleanupSpeechRun(run, true);
    if (clearCache) clearSpeechCache();
    clearSpeechFailure();
    updateSpeechButtons();
  }

  function finishSpeech(run, error = null) {
    if (state.speech.current !== run) return;
    state.speech.current = null;
    cleanupSpeechRun(run, false);
    if (error) {
      state.speech.queue.length = 0;
      if (error.name !== 'NotAllowedError' &&
          state.speech.cache?.key === run.cacheKey) clearSpeechCache();
      if (error.name === 'NotAllowedError') {
        if (!run.manual) state.speech.autoBlocked = true;
        toast(run.manual
          ? '浏览器阻止了播放，请再次点击“朗读”'
          : '浏览器限制了自动播放，请点击消息下方的“朗读”');
      } else if (error.name !== 'AbortError') {
        toast((run.manual ? '朗读失败：' : '自动朗读失败：') +
          (error.message || '请稍后重试'));
      }
      setSpeechFailure(run.key);
      return;
    }
    updateSpeechButtons();
    processSpeechQueue();
  }

  async function startSpeech(msg, manual, peerId, text) {
    clearSpeechFailure();
    stopVoicePlayback();
    pauseVoicePreview();
    const run = {
      id: ++state.speech.seq,
      key: String(msg.key),
      mid: String(msg.mid || ''),
      peerId,
      manual,
      phase: 'loading',
      cacheKey: `${peerId}:${msg.mid || msg.key}`,
      controller: new AbortController(),
      audio: null,
      objectUrl: '',
    };
    state.speech.current = run;
    updateSpeechButtons();
    try {
      let blob = state.speech.cache?.key === run.cacheKey
        ? state.speech.cache.blob : null;
      if (!blob) {
        const res = await apiFetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ peer_id: peerId, text }),
          signal: run.controller.signal,
          cache: 'no-store',
        });
        if (!res.ok) {
          const out = await res.json().catch(() => ({}));
          throw new Error(out.error || ('HTTP ' + res.status));
        }
        blob = await res.blob();
        if (!blob.size) throw new Error('语音服务返回了空音频');
        if (state.speech.current !== run) return;
        state.speech.cache = { key: run.cacheKey, blob };
      }
      if (state.speech.current !== run) return;
      run.objectUrl = URL.createObjectURL(blob);
      run.audio = new Audio();
      run.audio.preload = 'auto';
      run.audio.src = run.objectUrl;
      run.audio.onended = () => finishSpeech(run);
      run.audio.onerror = () => finishSpeech(run, new Error('音频播放失败'));
      run.phase = 'playing';
      updateSpeechButtons();
      await run.audio.play();
      if (state.speech.current !== run) return;
      if (manual) state.speech.autoBlocked = false;
    } catch (e) {
      if (state.speech.current !== run) return;
      finishSpeech(run, e);
    }
  }

  function playManualSpeech(msg) {
    if (isGroup()) return;
    if (voiceCaptureActive()) {
      toast('请先完成或取消正在进行的录音');
      return;
    }
    const peerId = String(state.bot.id || '');
    const voice = state.voiceConfigs[peerId];
    const text = speechTextFor(msg);
    if (!voice?.enabled) {
      toast('请先在角色设置中启用语音');
      return;
    }
    if (state.ttsSettings?.mode === 'off') {
      toast('请先在全局设置中开启语音服务');
      return;
    }
    if (!text) return;
    stopSpeech({ clearQueue: true, clearCache: false });
    state.speech.autoBlocked = false;
    startSpeech(msg, true, peerId, text);
  }

  function queueAutoSpeech(msg) {
    if (isGroup() || document.hidden || !viewingChat()) return;
    if (state.userVoice.phase !== 'idle') return;
    if (state.voicePlayback.current && !state.voicePlayback.current.audio?.paused) return;
    const peerId = curConvKey();
    const voice = state.voiceConfigs[peerId];
    if (!voice?.enabled || !voice.auto || state.speech.autoBlocked) return;
    if (state.ttsSettings?.mode === 'off') return;
    if (state.speech.current?.manual || !speechTextFor(msg)) return;
    if (state.speech.queue.length >= 12) state.speech.queue.shift();
    state.speech.queue.push({ msg, peerId });
    processSpeechQueue();
  }

  function processSpeechQueue() {
    if (state.speech.current) return;
    if (document.hidden || !viewingChat() || isGroup() || state.speech.autoBlocked) {
      state.speech.queue.length = 0;
      return;
    }
    while (state.speech.queue.length) {
      const item = state.speech.queue.shift();
      if (item.peerId !== curConvKey()) continue;
      const voice = state.voiceConfigs[item.peerId];
      const text = speechTextFor(item.msg);
      if (!voice?.enabled || !voice.auto || !text) continue;
      startSpeech(item.msg, false, item.peerId, text);
      return;
    }
  }

  async function loadStickerSets() {
    try {
      const res = await apiFetch('/api/sticker-sets', { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      state.stickerSets = (data && typeof data.sets === 'object') ? data.sets : {};
      state.stickerSetsLoaded = true;
      if (state.stickers) {
        renderStickerTabs();
        renderStickerGrid();
      }
      renderChatSettings();
    } catch (e) { /* 老服务端没有这个接口时静默 */ }
  }

  function visibleStickerGroups() {
    const all = state.stickers || [];
    if (state.stickerManage) return all;
    // ★ 「这个对话可用的表情包」是按私聊角色配的。群聊不该套用上一个私聊
    //   角色（实测会变成橘光的那套），群里的表情面板直接给全集。
    if (isGroup()) return all;
    const allowed = state.stickerSets[String(state.bot.id)];
    if (!Array.isArray(allowed)) return all;
    return all.filter((g) => allowed.includes(g.key || g.name));
  }

  // 「最近用过」：本地记住发出去的表情，打开面板时第一屏就能复用手感。
  const RECENT_STICKER_KEY = '__recent__';
  const RECENT_STICKER_LIMIT = 16;

  function visibleStickerItemsByUrl() {
    const map = new Map();
    for (const group of visibleStickerGroups()) {
      for (const raw of (group.items || [])) {
        const item = normalizeSticker(raw);
        if (item.url) map.set(item.url, item);
      }
    }
    return map;
  }

  function recentStickerItems() {
    if (!state.recentStickers.length) return [];
    const all = visibleStickerItemsByUrl();
    const out = [];
    for (const url of state.recentStickers) {
      const item = all.get(url);
      if (item) out.push(item);
    }
    return out;
  }

  function rememberRecentSticker(url) {
    const target = String(url || '');
    if (!target) return;
    state.recentStickers = [target,
      ...state.recentStickers.filter((item) => item !== target)]
      .slice(0, RECENT_STICKER_LIMIT);
    try {
      localStorage.setItem(LS_RECENT_STICKERS, JSON.stringify(state.recentStickers));
    } catch (e) { /* 存储不可用时只保留本次会话 */ }
  }

  async function loadStickers(force = false) {
    if (state.stickers && !force) {
      renderStickerTabs();
      renderStickerGrid();
      return;
    }
    els.stickerGrid.innerHTML = '';
    const loading = document.createElement('div');
    loading.className = 'panel-empty';
    loading.textContent = '正在加载表情包…';
    els.stickerGrid.appendChild(loading);
    if (!state.stickerSetsLoaded) loadStickerSets();

    try {
      const res = await apiFetch('/api/stickers', { cache: 'no-store' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      state.stickers = Array.isArray(data.groups) ? data.groups : [];
      const visible = visibleStickerGroups();
      if (!visible.some((g) => (g.key || g.name) === state.stickerGroupKey)) {
        state.stickerGroupKey = visible[0]?.key || visible[0]?.name || null;
      }
      renderStickerTabs();
      renderStickerGrid();
      renderChatSettings();
    } catch (e) {
      els.stickerGrid.innerHTML = '';
      const err = document.createElement('div');
      err.className = 'panel-empty';
      err.textContent = '表情包加载失败：' + (e?.message || e);
      els.stickerGrid.appendChild(err);
    }
  }

  function renderStickerTabs() {
    const groups = visibleStickerGroups();
    const recent = recentStickerItems();
    const showRecent = !state.stickerManage && recent.length > 0;
    const groupKeys = groups.map((g) => g.key || g.name);
    if (state.stickerGroupKey === RECENT_STICKER_KEY && !showRecent) {
      state.stickerGroupKey = groupKeys[0] || null;
    } else if (state.stickerGroupKey !== RECENT_STICKER_KEY &&
               !groupKeys.includes(state.stickerGroupKey)) {
      state.stickerGroupKey = groupKeys[0] || null;
    }
    els.stickerTabs.innerHTML = '';
    if (showRecent) {
      const recentBtn = document.createElement('button');
      recentBtn.type = 'button';
      recentBtn.className = 'tab recent' +
        (state.stickerGroupKey === RECENT_STICKER_KEY ? ' active' : '');
      recentBtn.textContent = `最近 (${recent.length})`;
      recentBtn.title = '最近用过的表情';
      recentBtn.addEventListener('click', () => {
        state.stickerGroupKey = RECENT_STICKER_KEY;
        state.stickerQuery = '';
        els.stickerSearch.value = '';
        renderStickerTabs();
        renderStickerGrid();
      });
      els.stickerTabs.appendChild(recentBtn);
    }
    groups.forEach((group) => {
      const key = group.key || group.name;
      const b = document.createElement('button');
      b.className = 'tab' + (key === state.stickerGroupKey ? ' active' : '');
      b.textContent = `${group.name} (${(group.items || []).length})`;
      b.addEventListener('click', () => {
        state.stickerGroupKey = key;
        state.stickerQuery = '';
        els.stickerSearch.value = '';
        renderStickerTabs();
        renderStickerGrid();
      });
      els.stickerTabs.appendChild(b);
    });
  }

  function normalizeSticker(item) {
    const safeDecode = (s) => {
      try { return decodeURIComponent(s); } catch (e) { return s; }
    };
    if (typeof item === 'string') {
      return {
        url: item,
        thumb: item,
        animated: /\.(gif|webp)(\?|$)/i.test(item),
        name: safeDecode((item.split('/').pop() || '')),
        path: '',
        group: '',
      };
    }
    const url = String(item?.url || '');
    return {
      url,
      thumb: String(item?.thumb || url),
      animated: !!item?.animated,
      name: safeDecode((url.split('/').pop() || '')),
      path: String(item?.path || ''),
      group: String(item?.group || ''),
    };
  }

  function addStickerTile() {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'sticker-item add';
    btn.title = '添加表情';
    btn.innerHTML = '<svg><use href="#i-plus"/></svg><span>添加</span>';
    btn.addEventListener('click', () => els.stickerUploadInput.click());
    return btn;
  }

  function renderStickerGrid() {
    const groups = visibleStickerGroups();
    const q = state.stickerQuery.trim().toLowerCase();
    let items = [];
    if (q) {
      const seen = new Set();
      for (const g of groups) {
        for (const raw of (g.items || [])) {
          const it = normalizeSticker(raw);
          const hay = (it.url + ' ' + it.name).toLowerCase();
          if (hay.includes(q) && !seen.has(it.url)) {
            seen.add(it.url);
            items.push(it);
          }
        }
      }
    } else if (state.stickerGroupKey === RECENT_STICKER_KEY) {
      items = recentStickerItems();
    } else {
      const group = groups.find((g) => (g.key || g.name) === state.stickerGroupKey);
      items = (group?.items || []).map(normalizeSticker);
    }

    els.stickerGrid.innerHTML = '';
    const empty = !items.length && !(state.stickerManage && !q);
    els.stickerEmpty.classList.toggle('hidden', !empty);
    if (empty) {
      els.stickerEmpty.textContent = q
        ? '没有找到这个表情…'
        : (state.stickerSetsLoaded && !state.stickerManage && !groups.length
          ? '这个对话还没有可用的表情包，去聊天设置里勾选，或点“管理”添加'
          : '这里还没有表情');
    }

    const frag = document.createDocumentFragment();
    if (state.stickerManage && !q) frag.appendChild(addStickerTile());
    for (const it of items) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'sticker-item loading';
      btn.title = state.stickerManage ? '点 × 删除' : '点击发送（悬停看动图）';
      btn.dataset.animated = it.animated ? '1' : '0';
      btn.dataset.url = it.url;
      const img = document.createElement('img');
      const originalSrc = resolveAsset(it.url);
      const thumbSrc = resolveAsset(it.thumb || it.url);
      let showingOriginal = originalSrc === thumbSrc;
      img.loading = 'lazy';
      img.decoding = 'async';
      img.src = thumbSrc;
      img.alt = '表情包';
      img.addEventListener('load', () => btn.classList.remove('loading'));

      const playAnim = () => {
        if (!CAN_HOVER || !it.animated) return;
        showingOriginal = true;
        img.src = originalSrc;
      };
      const stopAnim = () => {
        if (!CAN_HOVER || !it.animated) return;
        showingOriginal = originalSrc === thumbSrc;
        img.src = thumbSrc;
      };
      btn.addEventListener('mouseenter', playAnim);
      btn.addEventListener('mouseleave', stopAnim);

      img.addEventListener('error', () => {
        // 缩略图失败 → 退原图；原图也失败 → 隐藏这一格
        if (!showingOriginal) {
          showingOriginal = true;
          img.src = originalSrc;
          return;
        }
        btn.remove();
      });
      btn.appendChild(img);
      btn.addEventListener('click', () => {
        if (!state.stickerManage) sendSticker(it.url);
      });
      if (state.stickerManage && it.path) {
        const del = document.createElement('span');
        del.className = 'sticker-del';
        del.title = '删除这张表情';
        del.setAttribute('role', 'button');
        del.textContent = '×';
        del.addEventListener('click', (e) => {
          e.stopPropagation();
          deleteSticker(it);
        });
        btn.appendChild(del);
      }
      frag.appendChild(btn);
    }
    els.stickerGrid.appendChild(frag);
    els.stickerGrid.scrollTop = 0;
  }

  function setStickerManage(on) {
    state.stickerManage = !!on;
    els.stickerManageBtn.textContent = on ? '完成' : '管理';
    els.stickerManageBtn.classList.toggle('active', on);
    els.stickerManageBar.classList.toggle('hidden', !on);
    if (state.stickers) {
      renderStickerTabs();
      renderStickerGrid();
    }
  }

  async function deleteSticker(it) {
    if (!it.path) {
      toast('这张表情没有文件路径，无法删除');
      return;
    }
    if (!confirm(`从图库删除这张表情？\n${it.name || it.path}\n删除后 星伴 也不会再用它。`)) return;
    try {
      const res = await apiFetch('/api/stickers/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: it.path }),
      });
      const out = await res.json().catch(() => ({}));
      if (!res.ok || !out.ok) throw new Error(out.error || ('HTTP ' + res.status));
      toast('已从图库删除');
      await loadStickers(true);
    } catch (e) {
      toast('删除失败：' + (e?.message || e));
    }
  }

  async function uploadStickerFiles(fileList) {
    const isImage = (f) => (f.type && f.type.startsWith('image/')) ||
      /\.(png|jpe?g|gif|webp|bmp)$/i.test(f.name || '');
    const files = [...(fileList || [])].filter(isImage);
    if (!files.length) {
      toast('请选择图片文件');
      return;
    }
    const targetGroup = (state.stickerGroupKey && state.stickerGroupKey !== '其他')
      ? state.stickerGroupKey : 'custom';
    let ok = 0;
    for (const f of files) {
      if (f.size > 8 * 1024 * 1024) {
        toast(`${f.name || '图片'} 超过 8MB，已跳过`);
        continue;
      }
      try {
        const data = await readDataURL(f);
        const res = await apiFetch('/api/stickers/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: f.name || 'sticker.png',
            data,
            group: targetGroup,
          }),
        });
        const out = await res.json().catch(() => ({}));
        if (!res.ok || !out.ok) throw new Error(out.error || ('HTTP ' + res.status));
        ok += 1;
      } catch (e) {
        toast(`上传 ${f.name || '图片'} 失败：${(e?.message || e)}`);
      }
    }
    if (ok) {
      toast(`已添加 ${ok} 张表情`);
      state.stickerGroupKey = targetGroup;
      await loadStickers(true);
      await loadStickerSets();
    }
  }

  function openCategoryModal() {
    els.categoryName.value = '';
    els.categoryMask.classList.remove('hidden');
    setTimeout(() => els.categoryName.focus(), 50);
  }

  function closeCategoryModal() {
    els.categoryMask.classList.add('hidden');
  }

  async function createCategory() {
    const name = els.categoryName.value.trim();
    if (!name) {
      toast('请输入分类名称');
      els.categoryName.focus();
      return;
    }
    try {
      const res = await apiFetch('/api/sticker-category/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      const out = await res.json().catch(() => ({}));
      if (!res.ok || !out.ok) throw new Error(out.error || ('HTTP ' + res.status));
      closeCategoryModal();
      toast(`已创建分类「${out.name}」`);
      state.stickerGroupKey = out.key;
      await loadStickers(true);
      await loadStickerSets();
    } catch (e) {
      toast('创建失败：' + (e?.message || e));
    }
  }

  async function deleteActiveCategory() {
    const groups = visibleStickerGroups();
    const group = groups.find((g) => (g.key || g.name) === state.stickerGroupKey);
    if (!group) {
      toast('请先选择一个分类');
      return;
    }
    const key = group.key || group.name;
    if (!key || key === '其他') {
      toast('这个分类不能删除');
      return;
    }
    const count = (group.items || []).length;
    if (!confirm(`删除分类「${group.name}」？\n其中的 ${count} 张表情会一起删除，无法恢复。`)) {
      return;
    }
    try {
      const res = await apiFetch('/api/sticker-category/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key }),
      });
      const out = await res.json().catch(() => ({}));
      if (!res.ok || !out.ok) throw new Error(out.error || ('HTTP ' + res.status));
      toast(`已删除分类「${group.name}」`);
      state.stickerGroupKey = null;
      await loadStickers(true);
      await loadStickerSets();
    } catch (e) {
      toast('删除失败：' + (e?.message || e));
    }
  }

  async function sendSticker(url) {
    try {
      const res = await apiFetch(url);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const blob = await res.blob();
      const dataUrl = await new Promise((resolve, reject) => {
        const fr = new FileReader();
        fr.onload = () => resolve(String(fr.result));
        fr.onerror = () => reject(new Error('读取失败'));
        fr.readAsDataURL(blob);
      });
      const base64 = dataUrl.slice(dataUrl.indexOf(',') + 1);
      const name = decodeURIComponent((url.split('/').pop() || 'sticker.png'));
      const ext = (name.split('.').pop() || 'png').toLowerCase();
      const sendSeg = {
        type: 'image',
        data: {
          file: 'base64://' + base64,
          file_name: 'sticker.' + ext,
          sub_type: 1,
          summary: '[表情包]',
        },
      };
      const showSeg = {
        type: 'image',
        data: { file: url, sub_type: 1, summary: '[表情包]' },
      };
      await doSend([sendSeg], '[表情包]', [showSeg]);
      if (state.connected) rememberRecentSticker(url);
      if (state.stickers && !els.stickerPanel.classList.contains('hidden')) {
        renderStickerTabs();
        renderStickerGrid();
      }
    } catch (e) {
      toast('表情包发送失败：' + (e?.message || e));
    }
  }

  els.stickerSearch.addEventListener('input', () => {
    state.stickerQuery = els.stickerSearch.value || '';
    renderStickerGrid();
  });

  els.stickerManageBtn.addEventListener('click', () => {
    setStickerManage(!state.stickerManage);
  });
  els.stickerAddBtn.addEventListener('click', () => els.stickerUploadInput.click());
  els.stickerUploadInput.addEventListener('change', () => {
    const files = [...(els.stickerUploadInput.files || [])];
    els.stickerUploadInput.value = '';
    uploadStickerFiles(files);
  });
  els.stickerCategoryAdd.addEventListener('click', openCategoryModal);
  els.stickerCategoryDel.addEventListener('click', deleteActiveCategory);
  els.categoryClose.addEventListener('click', closeCategoryModal);
  els.categoryCancel.addEventListener('click', closeCategoryModal);
  els.categoryMask.addEventListener('click', (e) => {
    if (e.target === els.categoryMask) closeCategoryModal();
  });
  els.categoryCreate.addEventListener('click', createCategory);
  els.categoryName.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      createCategory();
    }
  });
  els.stickerGrid.addEventListener('dragover', (e) => {
    if (state.stickerManage && [...(e.dataTransfer?.types || [])].includes('Files')) {
      e.preventDefault();
      e.stopPropagation();
    }
  });
  els.stickerGrid.addEventListener('drop', (e) => {
    if (!state.stickerManage) return;
    e.preventDefault();
    e.stopPropagation();
    uploadStickerFiles(e.dataTransfer?.files);
  });

  // ---------------------------------------------------------- 面板开关
  function showPanel(id) {
    hidePanels();
    const panel = document.getElementById(id);
    if (!panel) return;
    panel.classList.remove('hidden');
    if (id === 'stickerPanel') {
      loadStickers();
      els.stickerBtn.classList.add('active');
    } else {
      els.emojiBtn.classList.add('active');
    }
  }

  function hidePanels() {
    if (state.stickerManage) setStickerManage(false);
    els.emojiPanel.classList.add('hidden');
    els.stickerPanel.classList.add('hidden');
    els.emojiBtn.classList.remove('active');
    els.stickerBtn.classList.remove('active');
  }

  function togglePanel(id) {
    const panel = document.getElementById(id);
    if (panel.classList.contains('hidden')) showPanel(id);
    else hidePanels();
  }

  els.emojiBtn.addEventListener('click', () => togglePanel('emojiPanel'));
  els.stickerBtn.addEventListener('click', () => togglePanel('stickerPanel'));
  els.railSticker.addEventListener('click', () => {
    if (window.matchMedia('(max-width: 880px)').matches) {
      els.appView.classList.add('mobile-chat');
    }
    showPanel('stickerPanel');
  });
  document.querySelectorAll('[data-close]').forEach((b) => {
    b.addEventListener('click', hidePanels);
  });

  // ---------------------------------------------------------- 右键菜单
  function canRecallMessage(msg) {
    if (!msg || msg.recalled || msg.system || !msg.mid) return false;
    const key = String(msg.conversation || curConvKey());
    const mid = String(msg.mid);
    return key.charAt(0) === 'g' ? /^g\d+$/.test(mid) : /^h\d+$/.test(mid);
  }

  function openCtx(x, y, msg) {
    closeConversationMenu(false);
    closeConversationActions(false);
    state.ctxMsg = msg;
    els.moreMenu.classList.add('hidden');
    els.ctxMenu.classList.remove('hidden');
    const show = (act, on) => {
      const b = els.ctxMenu.querySelector(`button[data-act="${act}"]`);
      if (b) b.classList.toggle('hidden', !on);
    };
    const inGroup = isGroup();
    show('resend', msg.dir === 'out' && msg.status === 'failed');
    show('recall', canRecallMessage(msg));
    // 私聊 → 可把这段对话分享/转发到某个群（用户要的「抖进群里」）
    show('shareGroup', !inGroup && !!state.groups.length);
    // 引用回复：群、私聊都支持（有稳定 mid 就能引用）
    show('quote', !msg.system && !msg.recalled && !!msg.mid);
    const rect = els.ctxMenu.getBoundingClientRect();
    const px = Math.min(x, window.innerWidth - rect.width - 8);
    const py = Math.min(y, window.innerHeight - rect.height - 8);
    els.ctxMenu.style.left = Math.max(8, px) + 'px';
    els.ctxMenu.style.top = Math.max(8, py) + 'px';
  }

  function closeCtx() {
    els.ctxMenu.classList.add('hidden');
    els.moreMenu.classList.add('hidden');
    state.ctxMsg = null;
  }

  els.ctxMenu.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-act]');
    if (!btn) return;
    const msg = state.ctxMsg;
    const act = btn.dataset.act;
    closeCtx();
    if (!msg) return;
    if (act === 'copy') copyText(msg.text || previewOf(msg));
    else if (act === 'quote') setQuote(msg);
    else if (act === 'resend') resend(msg);
    else if (act === 'recall') recallMessage(msg);
    else if (act === 'shareGroup') openGroupPickerFor([msg]);
    else if (act === 'delete') {
      const i = state.msgs.findIndex((m) => m.key === msg.key);
      if (i >= 0) state.msgs.splice(i, 1);
      for (const mid of messageMids(msg)) state.byMid.delete(mid);
      renderAll(false);
      syncConvPreview();
      toast('已从本机删除（不影响 星伴 的记忆）');
    }
  });

  // ---------------------------------------------------------- 多选 / 转发 / 撤回
  function applyRecallLocally(msg, key, silent = false) {
    if (!msg || msg.recalled) return false;
    // 同样按「会话键」定位（撤回只有私聊走这条路，但别再拿 state.bot 当身份）
    const k = String(key || curConvKey());
    const isCurrent = k === curConvKey();
    const list = isCurrent ? state.msgs : listFor(k);
    msg.recalled = msg.dir === 'out' ? 'me' : 'bot';
    state.selected.delete(msg.key);
    if (isCurrent) {
      refreshRow(msg);
      updateMultiBar();
      const last = list[list.length - 1];
      if (last && last.key === msg.key) syncConvPreview(k);
    } else {
      const last = list[list.length - 1];
      if (last) syncConvPreview(k);
      recomputeUnread(k);
    }
    if (!silent) {
      toast(msg.dir === 'out' ? '你撤回了一条消息' : '对方撤回了一条消息');
    }
    return true;
  }

  async function recallMessage(msg, quiet = false) {
    if (!msg || msg.recalled) return false;
    const key = String(msg.conversation || curConvKey());
    const mid = String(msg.mid || '');
    const messageKey = msg.key;
    if (!canRecallMessage(msg)) {
      if (!quiet) toast('这条消息没有可撤回的稳定消息 ID');
      return false;
    }
    const params = {
      message_id: mid,
      text: msg.text || '',
      ts: msg.ts || 0,
    };
    if (key.charAt(0) === 'g') params.group_id = key.slice(1);
    else params.peer_id = Number(key);
    try {
      const res = await call('delete_msg', params, 10000);
      if (!res || res.status !== 'ok') throw new Error(res?.wording || '撤回失败');
      const list = listFor(key);
      const target = list.find((m) => m.key === messageKey && m.mid === mid) ||
        findMessageByMid(list, mid);
      if (target) applyRecallLocally(target, key, true);
      if (!quiet) toast('已撤回');
      return true;
    } catch (e) {
      if (!quiet) toast('撤回失败：' + (e?.message || e));
      return false;
    }
  }

  function applySelection(next) {
    state.selected = next;
    for (const row of els.msgList.querySelectorAll('.msg-row[data-key]')) {
      const on = next.has(row.dataset.key);
      row.classList.toggle('selected', on);
      row.querySelector('.msg-check')?.setAttribute(
        'aria-checked', on ? 'true' : 'false');
    }
    updateMultiBar();
  }

  function startMarquee(e) {
    if (!state.selectMode || e.button !== 0 || e.pointerType === 'touch') return;
    if (e.target.closest('button, a, input, textarea, .msg-check')) return;
    state.marquee = {
      startX: e.clientX,
      startY: e.clientY,
      pane: (els.chatMain || els.chatPane).getBoundingClientRect(),
      base: new Set(state.selected),
      active: false,
    };
    window.addEventListener('pointermove', onMarqueeMove);
    window.addEventListener('pointerup', endMarquee, { once: true });
    window.addEventListener('pointercancel', endMarquee);
  }

  function onMarqueeMove(e) {
    const m = state.marquee;
    if (!m) return;
    const dx = e.clientX - m.startX;
    const dy = e.clientY - m.startY;
    if (!m.active && Math.hypot(dx, dy) < 6) return;
    m.active = true;
    e.preventDefault();
    document.body.classList.add('marquee-dragging');
    const x1 = Math.min(m.startX, e.clientX);
    const x2 = Math.max(m.startX, e.clientX);
    const y1 = Math.min(m.startY, e.clientY);
    const y2 = Math.max(m.startY, e.clientY);
    const box = els.marqueeBox;
    box.classList.remove('hidden');
    box.style.left = (x1 - m.pane.left) + 'px';
    box.style.top = (y1 - m.pane.top) + 'px';
    box.style.width = (x2 - x1) + 'px';
    box.style.height = (y2 - y1) + 'px';
    const next = new Set(m.base);
    for (const row of els.msgList.querySelectorAll('.msg-row[data-key]')) {
      if (row.classList.contains('recalled')) continue;
      const r = row.getBoundingClientRect();
      if (r.bottom < y1 || r.top > y2 || r.right < x1 || r.left > x2) continue;
      next.add(row.dataset.key);
    }
    applySelection(next);
  }

  function endMarquee() {
    const m = state.marquee;
    if (!m) return;
    if (m.active) state.suppressClickUntil = Date.now() + 300;
    state.marquee = null;
    document.body.classList.remove('marquee-dragging');
    els.marqueeBox.classList.add('hidden');
    window.removeEventListener('pointermove', onMarqueeMove);
    window.removeEventListener('pointerup', endMarquee);
    window.removeEventListener('pointercancel', endMarquee);
  }

  function enterSelectMode(initialMsg = null) {
    if (state.selectMode) return;
    state.selectMode = true;
    state.selected.clear();
    els.msgList.classList.add('selecting');
    els.multiBar.classList.remove('hidden');
    els.composer.classList.add('hidden');
    if (initialMsg) toggleSelect(initialMsg);
    updateMultiBar();
    toast('点消息前面的圆圈多选');
  }

  function exitSelectMode() {
    if (!state.selectMode) return;
    endMarquee();
    state.selectMode = false;
    state.selected.clear();
    els.msgList.classList.remove('selecting');
    els.multiBar.classList.add('hidden');
    els.composer.classList.remove('hidden');
    els.msgList.querySelectorAll('.msg-row.selected').forEach((r) => {
      r.classList.remove('selected');
    });
    updateMultiBar();
  }

  function toggleSelect(msg) {
    if (!state.selectMode || !msg || msg.recalled) return;
    if (state.selected.has(msg.key)) state.selected.delete(msg.key);
    else state.selected.add(msg.key);
    const row = rowElOf(msg);
    if (row) {
      const on = state.selected.has(msg.key);
      row.classList.toggle('selected', on);
      row.querySelector('.msg-check')?.setAttribute('aria-checked', on ? 'true' : 'false');
    }
    updateMultiBar();
  }

  function selectedMsgs() {
    return state.msgs
      .filter((m) => state.selected.has(m.key) && !m.recalled)
      .sort((a, b) => a.ts - b.ts);
  }

  function updateMultiBar() {
    const n = state.selected.size;
    if (els.multiCount) els.multiCount.textContent = `已选 ${n} 条`;
    if (!els.multiBar) return;
    const recallable = selectedMsgs().filter(canRecallMessage).length;
    els.multiBar.querySelectorAll('button[data-multi]').forEach((b) => {
      if (b.dataset.multi === 'cancel') return;
      b.disabled = b.dataset.multi === 'recall' ? recallable === 0 : n === 0;
    });
  }

  function copySelected() {
    const msgs = selectedMsgs();
    if (!msgs.length) { toast('先选几条消息'); return; }
    copyText(msgs.map((m) => m.text || previewOf(m)).join('\n'));
  }

  async function recallSelected() {
    const key = curConvKey();
    const msgs = selectedMsgs().filter(canRecallMessage);
    if (!msgs.length) { toast('没有可撤回的消息'); return; }
    let ok = 0;
    for (const m of msgs) {
      if (await recallMessage(m, true)) ok += 1;
    }
    toast(ok ? `已撤回 ${ok} 条` : '没有可撤回的消息');
    if (curConvKey() === key) exitSelectMode();
  }

  function forwardSegsFor(msg) {
    const segs = [];
    for (const seg of (msg.segs || [])) {
      if (!seg || typeof seg !== 'object') continue;
      if (seg.type === 'text') {
        const t = String(seg.data?.text || '');
        if (t) segs.push({ type: 'text', data: { text: t } });
      } else if (seg.type === 'image' || seg.type === 'mface' ||
                 seg.type === 'marketface') {
        const sticker = isStickerSeg(seg);
        const url = resolveAsset(imageUrlOf(seg), false);
        if (url && /^https?:\/\//i.test(url)) {
          segs.push({
            type: 'image',
            data: {
              file: url,
              sub_type: sticker ? 1 : 0,
              summary: sticker ? '[表情包]' : '[图片]',
            },
          });
        } else {
          segs.push({
            type: 'text',
            data: { text: sticker ? '[表情包]' : '[图片]' },
          });
        }
      }
    }
    if (!segs.length) {
      segs.push({ type: 'text', data: { text: msg.text || previewOf(msg) } });
    }
    return segs;
  }

  function mergedForwardText(msgs) {
    const lines = [`【聊天记录】与${curPeerName()}的聊天`];
    for (const m of msgs) {
      const who = m.dir === 'out' ? state.me.name
        : (m.sender ? m.sender.name : curPeerName());
      lines.push(`${fmtClock(m.ts)} ${who}：${m.text || previewOf(m)}`);
    }
    return lines.join('\n');
  }

  // OneBot 原生「聊天记录」节点：发出去之后卡片可以点开逐条查看，
  // 不再是塞进气泡的一长段纯文本。
  function forwardNodesFor(msgs) {
    return msgs.map((m) => {
      const out = m.dir === 'out';
      const sender = out
        ? { id: String(state.me.id || ''), name: state.me.name || '我' }
        : { id: m.sender?.id ? String(m.sender.id) : String(state.bot?.id || ''),
            name: m.sender?.name || curPeerName() };
      return {
        type: 'node',
        data: {
          user_id: sender.id,
          nickname: sender.name,
          time: Number(m.ts) || 0,
          content: forwardSegsFor(m),
        },
      };
    });
  }

  function openForwardModal(mode) {
    const msgs = selectedMsgs();
    if (!msgs.length) { toast('先选几条消息'); return; }
    state.forwardMode = mode;
    els.forwardTitle.textContent = mode === 'merge' ? '合并转发到' : '逐条转发到';
    els.forwardList.innerHTML = '';
    const targets = [];
    // 群聊排前面（转发到群里是用户最想要的），再是其他好友
    for (const g of state.groups) {
      targets.push({ kind: 'group', id: String(g.group_id), name: g.group_name || '群聊' });
    }
    for (const c of state.characters) {
      if (isGroup() || c.id !== Number(state.bot.id)) {
        targets.push({ kind: 'private', id: c.id, name: c.name });
      }
    }
    for (const t of targets) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'forward-item';
      const av = document.createElement('div');
      av.className = 'avatar ' + (t.kind === 'group' ? 'group-avatar' : 'bot-avatar');
      if (t.kind === 'group') fillGroupAvatar(av, t.name, t.id);
      else fillAvatar(av, t.name, t.id);
      const name = document.createElement('span');
      name.textContent = t.name;
      if (t.kind === 'group') {
        const tag = document.createElement('em');
        tag.className = 'forward-tag';
        tag.textContent = '群';
        name.appendChild(tag);
      }
      btn.append(av, name);
      btn.addEventListener('click', () => forwardTo(t));
      els.forwardList.appendChild(btn);
    }
    if (!targets.length) {
      const empty = document.createElement('p');
      empty.className = 'cs-hint';
      empty.textContent = '还没有别的聊天对象，先添加一个角色或建个群吧。';
      els.forwardList.appendChild(empty);
    }
    els.forwardMask.classList.remove('hidden');
  }

  function closeForwardModal() {
    els.forwardMask.classList.add('hidden');
    state.forwardMode = '';
  }

  // 把选中的几条消息转发/分享到目标（群或好友）
  async function forwardTo(target) {
    const msgs = selectedMsgs();
    const mode = state.forwardMode;
    if (!msgs.length) { closeForwardModal(); return; }
    const isGrp = target && target.kind === 'group';
    const payloadBase = isGrp
      ? { group_id: String(target.id) }
      : { message_type: 'private', user_id: Number(target.id) };
    const action = isGrp ? 'send_group_msg' : 'send_msg';
    try {
      if (mode === 'merge') {
        const forwardAction = isGrp
          ? 'send_group_forward_msg' : 'send_private_forward_msg';
        try {
          await call(forwardAction, {
            ...payloadBase,
            messages: forwardNodesFor(msgs),
          }, 25000);
        } catch (err) {
          // 老通道不支持 node 卡片时退回纯文本，保持「合并转发」可用。
          await call(action, {
            ...payloadBase,
            message: [{ type: 'text', data: { text: mergedForwardText(msgs) } }],
          }, 25000);
        }
      } else {
        for (const m of msgs) {
          await call(action, { ...payloadBase, message: forwardSegsFor(m) }, 25000);
        }
      }
      toast(`已转发 ${msgs.length} 条给 ${target?.name || '对方'}`);
      closeForwardModal();
      exitSelectMode();
    } catch (e) {
      toast('转发失败：' + (e?.message || e));
    }
  }

  // 右键「分享到群」：选一个群，再把这几条消息转过去（友尽式打小报告的小道具）
  function openGroupPickerFor(msgs) {
    if (!state.groups.length) { toast('还没有群，先建一个群吧'); return; }
    const chosen = msgs.filter((m) => m && !m.recalled);
    if (!chosen.length) return;
    els.forwardMask.classList.remove('hidden');
    els.forwardTitle.textContent = '分享到群';
    state.forwardMode = 'merge';
    els.forwardList.innerHTML = '';
    // 借用转发弹窗的选中集合不方便，这里直接用一次性的消息列表
    const prevSel = state.selected;
    state.selected = new Set(chosen.map((m) => m.key));
    for (const g of state.groups) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'forward-item';
      const av = document.createElement('div');
      av.className = 'avatar group-avatar';
      fillGroupAvatar(av, g.group_name || '群聊', g.group_id);
      const name = document.createElement('span');
      name.textContent = g.group_name || '群聊';
      btn.append(av, name);
      btn.addEventListener('click', async () => {
        await forwardTo({ kind: 'group', id: String(g.group_id),
                          name: g.group_name || '群聊' });
        state.selected = prevSel;
      });
      els.forwardList.appendChild(btn);
    }
    els.forwardMask.addEventListener('click', () => { state.selected = prevSel; },
      { once: true });
  }

  els.multiBar.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-multi]');
    if (!btn) return;
    const act = btn.dataset.multi;
    if (act === 'cancel') exitSelectMode();
    else if (act === 'copy') copySelected();
    else if (act === 'recall') recallSelected();
    else if (act === 'forward-each') openForwardModal('each');
    else if (act === 'forward-merge') openForwardModal('merge');
  });

  // 多选模式下，鼠标在消息区拖出矩形即可框选
  els.msgScroll.addEventListener('pointerdown', startMarquee);

  els.forwardClose.addEventListener('click', closeForwardModal);
  els.forwardMask.addEventListener('click', (e) => {
    if (e.target === els.forwardMask) closeForwardModal();
  });

  // ---------------------------------------------------------- 群聊界面
  // 右侧面板参考 QQ 的群资料页：入群申请 + 群公告 + 群聊成员。
  // 群主能在面板上改名/发公告/开全员禁言/@人/设管理员/踢人。

  function curGroupDetail() {
    return isGroup() ? (state.groupDetail[String(state.peer.id)] || null) : null;
  }

  function renderGroupSide() {
    if (!els.groupSide) return;
    if (!isGroup() || state.groupSideHidden) {
      els.groupSide.classList.add('hidden');
      return;
    }
    els.groupSide.classList.remove('hidden');
    const gid = String(state.peer.id);
    const d = curGroupDetail();
    const name = groupName(gid);
    els.gsName.textContent = name;
    fillGroupAvatar(els.gsAvatar, name, gid);
    if (els.chatAvatar) fillGroupAvatar(els.chatAvatar, name, gid);
    const count = d ? (d.member_count || (d.members || []).length)
                    : ((groupById(gid) || {}).member_count || 0);
    els.gsCount.textContent = `${count} 人` + ((d && d.mute_all) ? ' · 全员禁言中' : '');
    els.gsAnnounce.textContent = ((d && (d.announce || {}).text) || '还没有群公告');
    if (els.chatSub) {
      els.chatSub.textContent = ((d && d.mute_all) ? '全员禁言中 · ' : '') + `${count} 人`;
    }
    renderGroupRequests();
    renderGroupMembers();
    renderGroupFiles();
  }

  function renderGroupRequests() {
    if (!els.gsRequests) return;
    const d = curGroupDetail();
    const reqs = (d && d.pending) || [];
    els.gsRequestCard.classList.toggle('hidden', !reqs.length);
    if (els.gsRequestCount) els.gsRequestCount.textContent = String(reqs.length);
    els.gsRequests.innerHTML = '';
    for (const r of reqs) {
      // ★ 后端库里存的是 uid；用 user_id 兜底（取不到就会把空 uid 发给后端，
      //   结果点同意报「没有这个申请」）
      const uid = String(r.user_id || r.uid || '');
      const name = r.name || uid;
      const row = document.createElement('div');
      row.className = 'gs-req';
      const av = document.createElement('div');
      av.className = 'avatar bot-avatar';
      fillAvatar(av, name, uid);
      const info = document.createElement('div');
      info.className = 'gs-req-info';
      const nm = document.createElement('strong');
      nm.textContent = name;
      const note = document.createElement('span');
      note.textContent = r.note || '想加入这个群';
      info.append(nm, note);
      const acts = document.createElement('div');
      acts.className = 'gs-req-acts';
      const ok = document.createElement('button');
      ok.className = 'btn-primary mini-btn';
      ok.textContent = '同意';
      ok.addEventListener('click', () => resolveJoin(uid, true));
      const no = document.createElement('button');
      no.className = 'ghost mini-btn';
      no.textContent = '拒绝';
      no.addEventListener('click', () => resolveJoin(uid, false));
      acts.append(ok, no);
      row.append(av, info, acts);
      els.gsRequests.appendChild(row);
    }
  }

  async function resolveJoin(uid, approve) {
    try {
      await groupManage('resolve', {
        group_id: state.peer.id, user_id: uid, approve,
      });
      await loadGroups();
      renderConvList();
      await loadGroupDetail(state.peer.id);
      toast(approve ? '已同意入群' : '已拒绝申请');
    } catch (e) { toast('操作失败：' + (e.message || e)); }
  }

  function renderGroupMembers() {
    if (!els.gsMembers) return;
    const d = curGroupDetail();
    const members = (d && d.members) || [];
    const q = ((els.gsMemberSearch && els.gsMemberSearch.value) || '').trim();
    els.gsMembers.innerHTML = '';
    if (els.gsMemberCount) els.gsMemberCount.textContent = String(members.length);
    if (!members.length) {
      const empty = document.createElement('p');
      empty.className = 'cs-hint';
      empty.textContent = '成员还没同步过来…';
      els.gsMembers.appendChild(empty);
      return;
    }
    for (const m of members) {
      const name = m.nickname || String(m.user_id);
      if (q && !name.includes(q)) continue;
      const row = document.createElement('button');
      row.type = 'button';
      row.className = 'gs-member';
      const av = document.createElement('div');
      av.className = 'avatar';
      if (m.is_me || isOwner(m.user_id)) fillAvatar(av, state.me.name, state.me.id, '我');
      else fillAvatar(av, name, m.user_id);
      const info = document.createElement('div');
      info.className = 'gs-member-info';
      const nm = document.createElement('strong');
      nm.textContent = name;
      if (m.is_me || isOwner(m.user_id)) {
        const me = document.createElement('em');
        me.className = 'ms-role owner';
        me.textContent = '我';
        nm.appendChild(me);
      }
      info.appendChild(nm);
      const sub = document.createElement('span');
      const bits = [];
      if (m.role === 'owner') bits.push('群主');
      else if (m.role === 'admin') bits.push('管理员');
      bits.push('LV' + Number(m.level || 1));
      sub.textContent = bits.join(' · ');
      info.appendChild(sub);
      row.append(av, info);
      if (String(m.role) !== 'owner' && !(m.is_me || isOwner(m.user_id))) {
        const more = document.createElement('span');
        more.className = 'gs-member-more';
        more.innerHTML = '<svg><use href="#i-more"/></svg>';
        row.appendChild(more);
      }
      row.addEventListener('click', (e) => openMemberMenu(e, m));
      els.gsMembers.appendChild(row);
    }
  }

  function isAiMember(m) {
    const uid = String(m?.user_id || '');
    return !!uid && (m.is_ai === true || m.is_bot === true ||
      state.characters.some((c) => String(c.id) === uid));
  }

  function openMemberMenu(e, m) {
    e.stopPropagation();
    if (m.role === 'owner' || isOwner(m.user_id)) return;
    const detailMember = ((curGroupDetail()?.members) || [])
      .find((x) => String(x.user_id) === String(m.user_id));
    const menuMember = detailMember
      ? { ...m, allow_private_share: detailMember.allow_private_share }
      : m;
    state.memberMenuFor = menuMember;
    if (els.mactAdminText) {
      els.mactAdminText.textContent = menuMember.role === 'admin' ? '取消管理员' : '设为管理员';
    }
    if (els.mactPrivateShare) {
      els.mactPrivateShare.classList.toggle('hidden', !isAiMember(menuMember));
      if (els.mactPrivateShareText) {
        els.mactPrivateShareText.textContent = menuMember.allow_private_share
          ? '禁止 TA 自动分享私聊到本群'
          : '允许 TA 自动分享私聊到本群';
      }
    }
    els.memberMenu.classList.remove('hidden');
    const rect = els.memberMenu.getBoundingClientRect();
    els.memberMenu.style.left =
      Math.max(8, Math.min(e.clientX, window.innerWidth - rect.width - 8)) + 'px';
    els.memberMenu.style.top =
      Math.max(8, Math.min(e.clientY, window.innerHeight - rect.height - 8)) + 'px';
  }

  if (els.memberMenu) {
    els.memberMenu.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-mact]');
      if (!btn) return;
      const m = state.memberMenuFor;
      const act = btn.dataset.mact;
      const gid = String(state.peer.id);
      els.memberMenu.classList.add('hidden');
      if (!m || !isGroup()) return;
      if (act === 'at') atMember(m);
      else if (act === 'admin') toggleAdmin(m);
      else if (act === 'kick') kickMember(m);
      else if (act === 'privateShare') setPrivateShareConsent(m, gid);
    });
  }

  function addMention(id, name) {
    const sid = String(id);
    if (state.pendingMentions.some((x) => String(x.id) === sid)) return;
    state.pendingMentions.push({ id: sid, name });
  }

  function atMember(m) {
    addMention(m.user_id, m.nickname || String(m.user_id));
    insertAtCursor(`@${m.nickname || m.user_id} `);
    els.input.focus();
  }

  function atAll() {
    addMention('all', '全体成员');
    insertAtCursor('@全体成员 ');
    els.input.focus();
  }

  // @ 的显示名（把 at 段里的 QQ 号换成群名片）
  function atLabel(qq) {
    const s = String(qq);
    if (s === 'all' || s === '-1' || s === '0') return '@全体成员';
    const d = curGroupDetail();
    const m = ((d && d.members) || []).find((x) => String(x.user_id) === s);
    if (m && m.nickname) return '@' + m.nickname;
    // ★ 群详情还没拉到时不要显示「@3901000018」这种 QQ 号 —— 先用角色名兜底
    //   （否则历史消息一进群就是「@一串数字」，用户会以为 @ 坏了）。
    const c = (state.characters || []).find((x) => String(x.id) === s);
    if (c && c.name) return '@' + c.name;
    if (state.me && String(state.me.id) === s) return '@' + state.me.name;
    return '@' + s;
  }

  // 发送时把待发的 at 段拼到最前面（后端靠 at 段判断「@ 了谁」）
  // ★ 必须把输入框里那段「@名字 」剥掉：atMember/atAll 往输入框插的是纯文本
  //   「@橘雪莉 」，如果再原样留在 text 段里，气泡上就会出现**两遍**——
  //   一个 at 芯片 + 文本里的「@橘雪莉」（用户实测：气泡左边一块像空白的
  //   暗色芯片，后面又重复一遍名字）。
  function composeSegs(text) {
    const segs = [];
    let rest = String(text || '');
    for (const m of state.pendingMentions) {
      segs.push({ type: 'at', data: { qq: m.id === 'all' ? 'all' : Number(m.id) } });
      const label = '@' + String(m.name || m.id);
      const i = rest.indexOf(label);
      if (i >= 0) {
        rest = (rest.slice(0, i) + rest.slice(i + label.length)).replace(/^\s+/, '');
      }
    }
    // 只 @ 了人、一个字没说：保留原文，否则后端会当成空消息整条丢掉
    const body = rest.trim() ? rest : String(text || '');
    segs.push({ type: 'text', data: { text: body } });
    return segs;
  }

  async function setPrivateShareConsent(m, gid) {
    const on = !m.allow_private_share;
    const name = m.nickname || m.user_id;
    if (on && !window.confirm(
      `确定允许「${name}」自动分享私聊到本群？\n\n` +
      '开启后，你与 TA 的私聊内容可能会被分享到本群，并被群成员看到。')) return;
    try {
      await groupManage('private_share_consent', {
        group_id: gid, user_id: m.user_id, on,
      });
      await loadGroupDetail(gid);
      toast(on ? `已允许 ${name} 自动分享私聊到本群` : `已禁止 ${name} 自动分享私聊到本群`);
    } catch (e) { toast('授权操作失败：' + (e.message || e)); }
  }

  async function toggleAdmin(m) {
    try {
      await groupManage('admin', {
        group_id: state.peer.id, user_id: m.user_id, on: m.role !== 'admin',
      });
      toast(m.role === 'admin' ? '已取消管理员' : '已设为管理员');
    } catch (e) { toast('操作失败：' + (e.message || e)); }
  }

  async function kickMember(m) {
    const name = m.nickname || m.user_id;
    if (!window.confirm(`把「${name}」移出群聊？`)) return;
    try {
      await groupManage('kick', { group_id: state.peer.id, user_id: m.user_id });
      await loadGroups();
      renderConvList();
      await loadGroupDetail(state.peer.id);
      toast(`已把 ${name} 移出群聊`);
    } catch (e) { toast('操作失败：' + (e.message || e)); }
  }

  // ---- 引用回复 ----

  function quoteLabelOf(msg) {
    if (!msg) return { name: '', text: '' };
    const name = msg.dir === 'out' ? state.me.name
      : (msg.sender ? msg.sender.name : state.bot.name);
    return { name, text: previewOf(msg) };
  }

  function setQuote(msg) {
    if (!msg || !msg.mid) { toast('这条消息还没消息 ID，无法引用'); return; }
    state.replyTo = msg;
    renderQuoteBar();
    els.input.focus();
  }

  // 引用时该 @ 谁：QQ 的群引用会自动 @ 被引用消息的发送者。
  // 引用自己发的不加 @（不给自己发提醒）；系统消息没有发送者，也不加。
  function quoteAtTarget(msg) {
    if (!msg || msg.system) return null;
    const sid = msg.sender ? String(msg.sender.id || '') : '';
    if (!sid || sid === String(state.me.id) || isOwner(sid)) return null;
    return { id: sid, name: (msg.sender && msg.sender.name) || sid };
  }

  // at 段的 qq 字段：能转数字就转（和手动 @ 的写法保持一致），否则原样
  function atQqOf(id) {
    const s = String(id || '');
    return /^\d+$/.test(s) ? Number(s) : s;
  }

  function clearQuote() {
    state.replyTo = null;
    renderQuoteBar();
  }

  function renderQuoteBar() {
    if (!els.quoteBar) return;
    const q = state.replyTo;
    if (!q) {
      els.quoteBar.classList.add('hidden');
      return;
    }
    const label = quoteLabelOf(q);
    els.qbName.textContent = label.name;
    els.qbText.textContent = label.text;
    els.quoteBar.classList.remove('hidden');
  }

  if (els.qbClose) els.qbClose.addEventListener('click', clearQuote);

  // ---- 群文件 / 群相册 ----

  async function loadGroupFiles(gid) {
    const g = String(gid || '');
    if (!g) return;
    try {
      const res = await apiFetch(
        `/api/groups/files?group_id=${encodeURIComponent(g)}`,
        { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      state.groupFiles[g] = (data && data.files) || [];
      if (isGroup() && String(state.peer.id) === g) renderGroupFiles();
    } catch (e) { /* 老服务端没有这个接口 */ }
  }

  function fileUrl(it, gid) {
    return resolveAsset(`/api/groups/file?group_id=${encodeURIComponent(gid)}`
      + `&file_id=${encodeURIComponent(it.id)}`);
  }

  function fmtSize(n) {
    const v = Number(n || 0);
    if (v >= 1048576) return (v / 1048576).toFixed(1) + ' MB';
    if (v >= 1024) return (v / 1024).toFixed(0) + ' KB';
    return v + ' B';
  }

  function renderGroupFiles() {
    if (!els.gsFiles || !isGroup()) return;
    const gid = String(state.peer.id);
    const items = state.groupFiles[gid] || [];
    const album = state.groupFileTab === 'album';
    const list = items.filter((it) => (album ? it.kind === 'image' : true));
    if (els.gsFileCount) els.gsFileCount.textContent = String(items.length);
    els.gsFiles.innerHTML = '';
    if (!list.length) {
      const empty = document.createElement('p');
      empty.className = 'cs-hint';
      empty.textContent = album ? '群相册还是空的' : '还没有群文件';
      els.gsFiles.appendChild(empty);
      return;
    }
    if (album) {
      const grid = document.createElement('div');
      grid.className = 'gs-album';
      for (const it of list) {
        if (it.kind !== 'image') continue;
        const img = document.createElement('img');
        img.loading = 'lazy';
        img.alt = it.name;
        img.src = fileUrl(it, gid);
        img.addEventListener('click', () => openLightbox(fileUrl(it, gid)));
        grid.appendChild(img);
      }
      els.gsFiles.appendChild(grid);
      return;
    }
    for (const it of list) {
      const row = document.createElement('div');
      row.className = 'gs-file';
      const ico = document.createElement('span');
      ico.className = 'gs-file-ico';
      ico.innerHTML = `<svg><use href="#i-${it.kind === 'image' ? 'image' : 'folder'}"/></svg>`;
      const info = document.createElement('div');
      info.className = 'gs-file-info';
      const nm = document.createElement('strong');
      nm.textContent = it.name;
      const sub = document.createElement('span');
      sub.textContent = `${fmtSize(it.size)} · ${it.uploader || ''}`;
      info.append(nm, sub);
      const dl = document.createElement('a');
      dl.className = 'gs-file-dl';
      dl.href = fileUrl(it, gid);
      dl.setAttribute('download', it.name);
      dl.title = '下载';
      dl.innerHTML = '<svg><use href="#i-download"/></svg>';
      row.append(ico, info, dl);
      if (it.uploader && it.uploader === state.me.name) {
        const del = document.createElement('button');
        del.className = 'gs-file-del';
        del.title = '删除';
        del.innerHTML = '<svg><use href="#i-trash"/></svg>';
        del.addEventListener('click', () => deleteGroupFile(it));
        row.appendChild(del);
      }
      els.gsFiles.appendChild(row);
    }
  }

  async function uploadGroupFiles(files) {
    if (!isGroup() || !files.length) return;
    // ★ 群号要**先抓下来**：下面每个文件都要 await 一次上传，如果在上传途中
    //   用户切到了别的会话，`state.peer.id` 就变了，后面的文件会被传到别的群。
    const gid = String(state.peer.id);
    let ok = 0;
    for (const f of files) {
      if (f.size > 20 * 1024 * 1024) { toast(`「${f.name}」超过 20MB，跳过`); continue; }
      try {
        const dataUrl = await readDataURL(f);
        const res = await apiFetch('/api/groups/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ group_id: gid, name: f.name, data: dataUrl }),
        });
        const out = await res.json().catch(() => ({}));
        if (!res.ok || !out.ok) throw new Error(out.error || ('HTTP ' + res.status));
        ok += 1;
      } catch (e) {
        toast(`「${f.name}」上传失败：` + (e.message || e));
      }
    }
    if (ok) {
      toast(`已上传 ${ok} 个文件`);
      await loadGroupFiles(gid);
    }
  }

  async function deleteGroupFile(it) {
    if (!window.confirm(`删除群文件「${it.name}」？`)) return;
    const gid = String(state.peer.id);
    try {
      const res = await apiFetch('/api/groups/files/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ group_id: gid, file_id: it.id }),
      });
      const out = await res.json().catch(() => ({}));
      if (!res.ok || !out.ok) throw new Error(out.error || ('HTTP ' + res.status));
      toast('已删除');
      await loadGroupFiles(gid);
    } catch (e) { toast('删除失败：' + (e.message || e)); }
  }

  if (els.gsUpload) els.gsUpload.addEventListener('click', () => {
    if (!isGroup()) return;
    els.gsFileInput.value = '';
    els.gsFileInput.click();
  });
  if (els.gsFileInput) els.gsFileInput.addEventListener('change', () => {
    const files = [...(els.gsFileInput.files || [])];
    els.gsFileInput.value = '';
    uploadGroupFiles(files);
  });
  if (els.gsFileTabs) els.gsFileTabs.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-ftab]');
    if (!b) return;
    state.groupFileTab = b.dataset.ftab;
    els.gsFileTabs.querySelectorAll('button').forEach((x) => {
      x.classList.toggle('active', x === b);
    });
    renderGroupFiles();
  });

  // ---- 建群 / 邀请 ----

  function memberPicker(container, opts) {
    container.innerHTML = '';
    const inGroup = new Set((opts.existing || []).map(String));
    const picked = new Set();
    for (const c of state.characters) {
      if (c.id === Number(state.bot.id) && !opts.includeCurrent) continue;
      const cid = String(c.id);
      const already = inGroup.has(cid);
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'cg-member';
      btn.dataset.cid = cid;
      const av = document.createElement('div');
      av.className = 'avatar bot-avatar';
      fillAvatar(av, c.name, c.id);
      const name = document.createElement('span');
      name.textContent = c.name;
      const tick = document.createElement('i');
      tick.className = 'cg-tick';
      tick.innerHTML = '<svg><use href="#i-check"/></svg>';
      if (already) {
        const tag = document.createElement('em');
        tag.className = 'cg-tag';
        tag.textContent = '已在群';
        btn.append(av, name, tag);
        btn.disabled = true;
      } else {
        btn.append(av, name, tick);
        btn.addEventListener('click', () => {
          if (picked.has(cid)) {
            picked.delete(cid);
            btn.classList.remove('on');
          } else {
            picked.add(cid);
            btn.classList.add('on');
          }
        });
      }
      container.appendChild(btn);
    }
    if (!container.childNodes.length) {
      const empty = document.createElement('p');
      empty.className = 'cs-hint';
      empty.textContent = '还没有可邀请的好友。';
      container.appendChild(empty);
    }
    return picked;
  }

  function openCreateGroup() {
    if (!state.characters.length) { toast('先添加一个角色吧'); return; }
    els.cgName.value = '';
    memberPicker(els.cgMembers, { includeCurrent: false });
    els.createGroupMask.classList.remove('hidden');
    setTimeout(() => els.cgName.focus(), 50);
  }

  function closeCreateGroup() {
    els.createGroupMask.classList.add('hidden');
  }

  async function createGroupNow() {
    const name = els.cgName.value.trim();
    if (!name) { toast('先给群起个名字'); els.cgName.focus(); return; }
    const memberIds = [...els.cgMembers.querySelectorAll('.cg-member.on')]
      .map((b) => Number(b.dataset.cid)).filter(Boolean);
    els.cgCreate.disabled = true;
    try {
      const res = await apiFetch('/api/groups/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, members: memberIds }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data || data.ok === false) {
        throw new Error((data && data.error) || '创建失败');
      }
      if (data.group_id) {
        state.groupDetail[String(data.group_id)] = data;
        syncGroupSummary(data);
      }
      await loadGroups();
      closeCreateGroup();
      renderConvList();
      renderContactList();
      if (data.group_id) selectPeer('group', data.group_id);
      toast('群已创建');
    } catch (e) {
      toast('创建失败：' + (e.message || e));
    } finally {
      els.cgCreate.disabled = false;
    }
  }

  async function openInvite() {
    if (!isGroup()) return;
    // ★ 先把群详情拿到手再建选择器 —— 以前详情还在路上时 members 是空的，
    //   于是「已在群」的标记全失，已经在群里的人也会出现在可邀请列表里。
    await loadGroupDetail(state.peer.id, { render: false });
    const d = curGroupDetail();
    if (!d || !(d.members || []).length) {
      toast('成员还没同步过来，稍等一下再点');
      return;
    }
    const existing = (d.members || []).map((m) => String(m.user_id));
    const picked = memberPicker(els.inviteMembers, { existing, includeCurrent: true });
    els.inviteMask.classList.remove('hidden');
    state.invitePicked = picked;
  }

  async function inviteNow() {
    const picked = state.invitePicked;
    els.inviteMask.classList.add('hidden');
    if (!picked || !picked.size) return;
    const d = curGroupDetail();
    const already = new Set(((d && d.members) || []).map((m) => String(m.user_id)));
    const targets = [...picked].filter((uid) => !already.has(String(uid)));
    if (!targets.length) { toast('选的人都已经在群里了'); return; }
    // ★ 群号先抓下来：循环里有 await，切会话后 state.peer.id 会变
    const gid = String(state.peer.id);
    let ok = 0;
    for (const uid of targets) {
      try {
        await groupManage('invite', {
          group_id: gid, user_id: uid,
          name: (state.characters.find((c) => String(c.id) === String(uid)) || {}).name || uid,
        });
        ok += 1;
      } catch (e) {
        toast(`「${uid}」邀请失败：` + (e.message || e));
      }
    }
    await loadGroups();
    await loadGroupDetail(gid);
    renderConvList();
    if (ok) toast(`已邀请 ${ok} 位好友入群`);
  }

  // ---- 群设置 / 公告 ----

  function openGroupSet() {
    if (!isGroup()) return;
    const d = curGroupDetail();
    const gid = String(state.peer.id);
    els.gsSetName.value = (d && d.group_name) || groupName(gid);
    els.gsSetMute.checked = !!(d && d.mute_all);
    els.gsSetSearch.checked = !d || !!d.searchable;
    els.gsSetGid.textContent = gid;
    if (els.gsSetAvatarPreview) {
      fillGroupAvatar(els.gsSetAvatarPreview, groupName(gid), gid);
    }
    renderGroupLimits();
    els.groupSetMask.classList.remove('hidden');
  }

  function closeGroupSet() { els.groupSetMask.classList.add('hidden'); }

  async function saveGroupName() {
    const name = els.gsSetName.value.trim();
    if (!name) { toast('群名不能为空'); return; }
    try {
      await groupManage('rename', { group_id: state.peer.id, name });
      await loadGroups();
      applyPeerIdentity();
      toast('群名已修改');
    } catch (e) { toast('改名失败：' + (e.message || e)); }
  }

  async function toggleGroupMute(on) {
    try {
      await groupManage('mute', { group_id: state.peer.id, on });
      await loadGroups();
      applyPeerIdentity();
      toast(on ? '已开启全员禁言' : '已解除全员禁言');
    } catch (e) {
      els.gsSetMute.checked = !on;
      toast('操作失败：' + (e.message || e));
    }
  }

  async function toggleGroupSearch(on) {
    try {
      await groupManage('searchable', { group_id: state.peer.id, on });
      toast(on ? '已允许被搜索加入' : '已关闭搜索加入');
    } catch (e) {
      els.gsSetSearch.checked = !on;
      toast('操作失败：' + (e.message || e));
    }
  }

  function openAnnounce() {
    if (!isGroup()) return;
    const d = curGroupDetail();
    els.announceInput.value = ((d && (d.announce || {}).text) || '');
    els.announceMask.classList.remove('hidden');
    setTimeout(() => els.announceInput.focus(), 50);
  }

  function closeAnnounce() { els.announceMask.classList.add('hidden'); }

  async function saveAnnounce() {
    const text = els.announceInput.value.trim();
    if (!text) { toast('公告不能为空'); return; }
    try {
      await groupManage('announce', { group_id: state.peer.id, text });
      await loadGroupDetail(state.peer.id);
      closeAnnounce();
      toast('公告已发布，群成员都会看到');
    } catch (e) { toast('发布失败：' + (e.message || e)); }
  }

  // ---- 群界面事件绑定 ----
  function closeGroupSide() {
    els.groupSide.classList.add('hidden');
    els.groupSide.classList.remove('mobile-open');
    state.groupSideHidden = true;
  }
  function toggleGroupSide() {
    if (!isGroup()) return;
    const mobile = window.matchMedia('(max-width: 880px)').matches;
    const open = !els.groupSide.classList.contains('hidden') &&
      (!mobile || els.groupSide.classList.contains('mobile-open'));
    if (open) {
      closeGroupSide();
      return;
    }
    state.groupSideHidden = false;
    els.groupSide.classList.remove('hidden');
    if (mobile) els.groupSide.classList.add('mobile-open');
    renderGroupSide();
  }
  if (els.gsClose) els.gsClose.addEventListener('click', closeGroupSide);
  if (els.chatAvatar) {
    els.chatAvatar.tabIndex = 0;
    els.chatAvatar.setAttribute('role', 'button');
    const openAvatar = () => {
      if (isGroup()) toggleGroupSide();
      else openCurrentCharacterView('profile');
    };
    els.chatAvatar.addEventListener('click', openAvatar);
    els.chatAvatar.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
      openAvatar();
    });
  }
  if (els.gsAnnounceEdit) els.gsAnnounceEdit.addEventListener('click', openAnnounce);
  if (els.gsInvite) els.gsInvite.addEventListener('click', openInvite);
  if (els.gsMemberSearch) els.gsMemberSearch.addEventListener('input', renderGroupMembers);
  if (els.btnGroupAt) els.btnGroupAt.addEventListener('click', () => {
    if (!isGroup()) return;
    els.memberMenu.classList.add('hidden');
    atAll();
  });
  if (els.btnGroupSet) els.btnGroupSet.addEventListener('click', openGroupSet);

  els.cgClose.addEventListener('click', closeCreateGroup);
  els.cgCancel.addEventListener('click', closeCreateGroup);
  els.createGroupMask.addEventListener('click', (e) => {
    if (e.target === els.createGroupMask) closeCreateGroup();
  });
  els.cgCreate.addEventListener('click', createGroupNow);
  els.cgName.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); createGroupNow(); }
  });

  els.inviteClose.addEventListener('click', () => els.inviteMask.classList.add('hidden'));
  els.inviteMask.addEventListener('click', (e) => {
    if (e.target === els.inviteMask) els.inviteMask.classList.add('hidden');
  });
  els.inviteDone.addEventListener('click', inviteNow);

  els.gsSetClose.addEventListener('click', closeGroupSet);
  els.groupSetMask.addEventListener('click', (e) => {
    if (e.target === els.groupSetMask) closeGroupSet();
  });
  els.gsSetSaveName.addEventListener('click', saveGroupName);
  els.gsSetName.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); saveGroupName(); }
  });
  els.gsSetMute.addEventListener('change', () => toggleGroupMute(els.gsSetMute.checked));
  els.gsSetSearch.addEventListener('change', () => toggleGroupSearch(els.gsSetSearch.checked));
  // ---- 群聊节奏参数（滑杆，像私聊的「热情/好感」）----

  function renderGroupLimits() {
    if (!els.gsLimits || !isGroup()) return;
    const d = curGroupDetail();
    const specs = (d && d.limits) || [];
    els.gsLimits.innerHTML = '';
    if (!specs.length) {
      const empty = document.createElement('p');
      empty.className = 'cs-hint';
      empty.textContent = '参数还没读上来…';
      els.gsLimits.appendChild(empty);
      return;
    }
    for (const it of specs) {
      if (it.kind === 'bool') {
        const row = document.createElement('div');
        row.className = 'setting-row compact';
        const box = document.createElement('div');
        box.innerHTML = `<strong>${it.label}</strong>`;
        const sw = document.createElement('label');
        sw.className = 'switch';
        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.checked = Number(it.value) > 0;
        cb.addEventListener('change', () => saveGroupLimit(it.key, cb.checked ? 1 : 0));
        const knob = document.createElement('i');
        sw.append(cb, knob);
        row.append(box, sw);
        els.gsLimits.appendChild(row);
        continue;
      }
      const label = document.createElement('label');
      label.className = 'trait-row';
      const nm = document.createElement('span');
      nm.className = 'trait-name';
      nm.textContent = it.label;
      const input = document.createElement('input');
      input.type = 'range';
      input.min = String(it.min);
      input.max = String(it.max);
      input.step = String(it.step || 1);
      input.value = String(it.value);
      input.dataset.limitKey = it.key;
      const val = document.createElement('span');
      val.className = 'trait-val';
      val.textContent = `${it.value}${it.unit || ''}`;
      input.addEventListener('input', () => {
        val.textContent = `${input.value}${it.unit || ''}`;
      });
      // 松手才写后端（拖动时不要连发）
      input.addEventListener('change', () => saveGroupLimit(it.key, Number(input.value)));
      label.append(nm, input, val);
      els.gsLimits.appendChild(label);
    }
  }

  async function saveGroupLimit(key, value) {
    if (!isGroup() || !key) return;
    try {
      await groupManage('limits', {
        group_id: state.peer.id, values: { [key]: value },
      });
      toast('已保存');
    } catch (e) {
      toast('保存失败：' + (e.message || e));
      await loadGroupDetail(state.peer.id);
    }
  }

  if (els.gsSetAvatar) els.gsSetAvatar.addEventListener('click', () => {
    state.avatarTarget = { kind: 'group', id: state.peer.id };
    els.groupAvatarInput.value = '';
    els.groupAvatarInput.click();
  });
  if (els.gsSetAvatarPreview) {
    els.gsSetAvatarPreview.addEventListener('click', () => {
      state.avatarTarget = { kind: 'group', id: state.peer.id };
      els.groupAvatarInput.value = '';
      els.groupAvatarInput.click();
    });
  }
  els.groupAvatarInput.addEventListener('change', () => {
    const f = els.groupAvatarInput.files && els.groupAvatarInput.files[0];
    if (f) startAvatarCrop(f);
  });

  els.announceClose.addEventListener('click', closeAnnounce);
  els.announceCancel.addEventListener('click', closeAnnounce);
  els.announceMask.addEventListener('click', (e) => {
    if (e.target === els.announceMask) closeAnnounce();
  });
  els.announceSave.addEventListener('click', saveAnnounce);

  // ---------------------------------------------------------- 在线状态（QQ 式）
  // 入口在「已连接」左边那颗状态胶囊（桌面）；移动端在顶部自己名字下面。
  // 状态是**主动性的乘数** —— 「Q我吧」会让她更主动地来找你，
  // 「离线 / 隐身」只是安静一点（不是不发），「请勿打扰」才真的完全不主动。
  // 图标一律用平面线性图标（#i-p-<key>），不用 emoji。
  const PRESENCE_FALLBACK = [
    { key: 'online', label: '在线', desc: '随时可以来找我', freq: 1 },
    { key: 'qme', label: 'Q我吧', desc: '我现在有空，来找我聊', freq: 2 },
    { key: 'away', label: '离开', desc: '暂时不在，稍微安静一点', freq: 0.6 },
    { key: 'busy', label: '忙碌', desc: '在忙，消息少一点', freq: 0.4 },
    { key: 'dnd', label: '请勿打扰', desc: '先别来打扰', freq: 0.12, silent: true },
    { key: 'invisible', label: '隐身', desc: '想安静待着，但别断联', freq: 0.35 },
    { key: 'offline', label: '离线', desc: '下线了，留言就好', freq: 0.25 },
  ];

  function presenceList() {
    return (state.presence && state.presence.statuses) || PRESENCE_FALLBACK;
  }

  function presenceIcon(key) {
    return '#i-p-' + (key || 'online');
  }

  // 建一个平面图标（<svg><use href="#i-p-xxx"/></svg>）
  function presenceSvg(key, cls) {
    const NS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(NS, 'svg');
    if (cls) svg.setAttribute('class', cls);
    const use = document.createElementNS(NS, 'use');
    use.setAttribute('href', presenceIcon(key));
    svg.appendChild(use);
    return svg;
  }

  function applyPresenceUI() {
    const p = state.presence;
    if (!p) return;
    if (els.railDot) els.railDot.dataset.p = p.status;
    if (els.mobileDot) els.mobileDot.dataset.p = p.status;
    if (els.mobileStatus) els.mobileStatus.textContent = p.label;
    if (els.mobileStatus) {
      const line = els.mobileStatus.closest('.mh-status');
      if (line) line.classList.toggle('ok', p.status === 'online' || p.status === 'qme');
    }
    if (els.railAvatar) els.railAvatar.title = `我（${p.label}）`;
    // 「已连接」左边那颗胶囊：图标 + 文字都跟着状态走
    if (els.presenceChip) {
      els.presenceChip.dataset.p = p.status;
      const use = els.presenceChip.querySelector('use');
      if (use) use.setAttribute('href', presenceIcon(p.status));
      if (els.presenceChipText) els.presenceChipText.textContent = p.label;
      els.presenceChip.title = `在线状态：${p.label}（${p.desc || ''}）`;
    }
  }

  async function loadPresence() {
    try {
      const res = await apiFetch('/api/presence', { cache: 'no-store' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) return;
      state.presence = data;
      applyPresenceUI();
    } catch (e) { /* 静默：在线状态是锦上添花，取不到也不影响聊天 */ }
  }

  async function savePresence(key) {
    if (!key) return;
    try {
      const res = await apiFetch('/api/presence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: key }),
      });
      const out = await res.json().catch(() => ({}));
      if (!res.ok || !out.ok) throw new Error(out.error || ('HTTP ' + res.status));
      state.presence = out;
      applyPresenceUI();
      toast(out.silent ? `已切换为「${out.label}」· 先安静一会儿`
                       : `已切换为「${out.label}」`);
    } catch (e) {
      toast('切换失败：' + (e?.message || e));
    }
  }

  function openPresenceMenu(anchorEl, mode) {
    closeCtx();
    const cur = state.presence ? state.presence.status : 'online';
    els.presenceMenu.innerHTML = '';
    const head = document.createElement('div');
    head.className = 'pm-head';
    head.textContent = '在线状态';
    els.presenceMenu.appendChild(head);

    for (const s of presenceList()) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'pm-item' + (s.key === cur ? ' active' : '');
      b.dataset.p = s.key;
      const ico = presenceSvg(s.key, 'pm-ico');
      const text = document.createElement('span');
      text.className = 'pm-text';
      const label = document.createElement('span');
      label.className = 'pm-label';
      label.textContent = s.label || s.key;
      const desc = document.createElement('span');
      desc.className = 'pm-desc';
      desc.textContent = s.desc || '';
      text.appendChild(label);
      text.appendChild(desc);
      b.appendChild(ico);
      b.appendChild(text);
      if (s.freq != null && s.key !== cur) {
        const freq = document.createElement('span');
        freq.className = 'pm-freq';
        freq.textContent = '×' + s.freq;
        b.appendChild(freq);
      }
      b.addEventListener('click', () => {
        els.presenceMenu.classList.add('hidden');
        savePresence(s.key);
      });
      els.presenceMenu.appendChild(b);
    }

    els.presenceMenu.classList.remove('hidden');
    const a = anchorEl.getBoundingClientRect();
    const r = els.presenceMenu.getBoundingClientRect();
    let px = mode === 'below' ? a.left : a.right + 10;
    let py = mode === 'below' ? a.bottom + 6 : a.top - 6;
    px = Math.max(8, Math.min(px, window.innerWidth - r.width - 8));
    py = Math.max(8, Math.min(py, window.innerHeight - r.height - 8));
    els.presenceMenu.style.left = px + 'px';
    els.presenceMenu.style.top = py + 'px';
  }

  function togglePresenceMenu(anchorEl, mode) {
    if (els.presenceMenu.classList.contains('hidden')) openPresenceMenu(anchorEl, mode);
    else els.presenceMenu.classList.add('hidden');
  }

  if (els.presenceChip) {
    // 入口：主界面「已连接」左边那颗状态胶囊
    els.presenceChip.addEventListener('click', (e) => {
      e.stopPropagation();
      togglePresenceMenu(els.presenceChip, 'below');
    });
  }
  if (els.mobilePresence) {
    els.mobilePresence.addEventListener('click', (e) => {
      e.stopPropagation();
      togglePresenceMenu(els.mobilePresence, 'below');
    });
  }

  // ---------------------------------------------------------- 更多 / 设置
  function openCurrentCharacterView(view) {
    if (isGroup() || !state.bot) return;
    const peerId = String(state.bot.id);
    if (view === 'memories') {
      state.profileId = peerId;
      openMemories();
    } else if (view === 'sharedLife') {
      state.profileId = peerId;
      openSharedLife();
    } else {
      openProfile(peerId);
    }
  }

  function openMoreMenu() {
    closeCtx();
    const rect = els.btnMore.getBoundingClientRect();
    els.moreMenu.classList.remove('hidden');
    const mrect = els.moreMenu.getBoundingClientRect();
    els.moreMenu.style.left = Math.max(8, Math.min(rect.right - mrect.width,
      window.innerWidth - mrect.width - 8)) + 'px';
    els.moreMenu.style.top = Math.max(8, Math.min(rect.bottom + 6,
      window.innerHeight - mrect.height - 8)) + 'px';
  }

  els.btnMore.addEventListener('click', (e) => {
    e.stopPropagation();
    openMoreMenu();
  });

  els.moreMenu.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-act]');
    if (!btn) return;
    const act = btn.dataset.act;
    closeCtx();
    if (['profile', 'memories', 'sharedLife'].includes(act)) {
      openCurrentCharacterView(act);
    } else if (act === 'searchMessages') {
      toggleChatSearch(true);
    } else if (act === 'chatStyle') {
      // ★ 群聊里没有「按对话的气泡设置」——以前这里会打开 state.bot（＝上一个
      //   私聊角色，实测是橘光）的设置页。群里改走群设置。
      if (isGroup()) openGroupSet();
      else openChatSettings();
    } else if (act === 'createGroup') {
      openCreateGroup();
    } else if (act === 'multiselect') {
      enterSelectMode();
    } else if (act === 'stickerManage') {
      showPanel('stickerPanel');
      setStickerManage(true);
    } else if (act === 'reconnect') {
      reconnectNow();
    } else if (act === 'clear') {
      if (!state.msgs.length) { toast('没有可清空的消息'); return; }
      if (confirm('清空本机显示？不会删除 星伴 的记忆和聊天记录。')) {
        // ★ 原地清空而不是换一个新数组 —— state.msgs 与它所属会话的缓存
        //   是同一个数组，换成新数组会让两边的引用脱钩（切走切回又冒出旧消息）
        state.msgs.length = 0;
        state.byMid.clear();
        // 窗口/翻页状态一起归零：清空后再「加载更早」要从服务端重新翻
        const ck0 = curConvKey();
        state.winStart[ck0] = 0;
        delete state.hasMore[ck0];
        delete state.historyCursor[ck0];
        state.historyError[ck0] = '';
        renderAll(false);
        syncConvPreview();
      }
    } else if (act === 'stapxs') {
      window.open('/stapxs/', '_blank');
    }
  });

  function reconnectNow() {
    clearTimeout(state.reconnectTimer);
    const old = state.ws;
    state.ws = null;
    state.wsGeneration += 1;
    state.connected = false;
    state.connecting = false;
    state.ready = false;
    state.liveBuffer = [];
    rejectAllPending('重新连接');
    discardSocket(old);
    setConn('warn', '连接中…');
    connect();
  }

  function updateNotificationSettings() {
    if (!els.settingsNotifications || !els.settingsNotificationState) return;
    const supported = 'Notification' in window;
    const permission = supported ? Notification.permission : 'unsupported';
    if (state.notifications && (!supported || permission !== 'granted')) {
      state.notifications = false;
      try { localStorage.setItem(LS_NOTIFICATIONS, '0'); } catch (e) { /* ignore */ }
    }
    els.settingsNotifications.checked = state.notifications;
    els.settingsNotifications.disabled = !supported || state.notificationPermissionBusy;
    let text = '关闭；仅在你主动开启时请求通知权限';
    if (!supported) text = '当前浏览器不支持页外通知';
    else if (state.notificationPermissionBusy) text = '正在请求通知权限…';
    else if (permission === 'denied') {
      text = '通知权限已被拒绝，可在浏览器站点设置中允许后重新开启';
    } else if (state.notifications) {
      text = '已开启；页面隐藏或其他会话收到消息时通知';
    } else if (permission === 'granted') {
      text = '关闭；开启后页面隐藏或其他会话收到消息时通知';
    }
    els.settingsNotificationState.textContent = text;
  }

  function setNotificationPreference(on) {
    state.notifications = !!on;
    try { localStorage.setItem(LS_NOTIFICATIONS, on ? '1' : '0'); }
    catch (e) { toast('通知偏好暂时无法保存'); }
    updateNotificationSettings();
  }

  els.settingsNotifications.addEventListener('change', async () => {
    if (!els.settingsNotifications.checked) {
      setNotificationPreference(false);
      return;
    }
    if (!('Notification' in window)) {
      setNotificationPreference(false);
      toast('当前浏览器不支持页外通知');
      return;
    }
    if (Notification.permission === 'denied') {
      setNotificationPreference(false);
      toast('通知权限已被拒绝，请在浏览器站点设置中允许通知');
      return;
    }
    state.notificationPermissionBusy = true;
    updateNotificationSettings();
    try {
      const permission = Notification.permission === 'granted'
        ? 'granted' : await Notification.requestPermission();
      if (permission === 'granted') {
        setNotificationPreference(true);
        toast('页外通知已开启');
      } else {
        setNotificationPreference(false);
        toast(permission === 'denied'
          ? '通知权限已被拒绝，可在浏览器站点设置中调整'
          : '未获得通知权限，页外通知未开启');
      }
    } catch (e) {
      setNotificationPreference(false);
      toast('通知权限请求失败：' + (e?.message || e));
    } finally {
      state.notificationPermissionBusy = false;
      updateNotificationSettings();
    }
  });

  function maybeNotifyIncoming(msg, key) {
    const k = String(key || msg?.conversation || '');
    if (!k || !msg || msg.dir !== 'in' || !state.notifications ||
        !('Notification' in window) || Notification.permission !== 'granted' ||
        isConversationMuted(k) || (!document.hidden && k === curConvKey())) return;
    const group = k.charAt(0) === 'g';
    const character = group ? null
      : state.characters.find((c) => String(c.id) === k);
    const title = group ? groupName(k.slice(1)) : (character?.name || '私聊消息');
    const preview = previewOf(msg);
    const body = group ? `${msg.sender?.name || '成员'}：${preview}` : preview;
    let notification;
    try {
      notification = new Notification(title, { body, tag: 'vol-' + k });
    } catch (e) {
      toast('无法显示系统通知，请检查浏览器通知设置');
      return;
    }
    notification.onclick = () => {
      window.focus();
      selectPeer(group ? 'group' : 'private', group ? k.slice(1) : k);
      openMobileChat();
      notification.close();
    };
  }

  function revealSettings() {
    els.settingsToken.value = state.token;
    els.settingsUrl.textContent = location.host;
    updateNotificationSettings();
    els.settingsMask.classList.remove('hidden');
  }

  function openSettings() {
    revealSettings();
    loadServiceSettings();
    loadDiagnostics();
  }

  function setSettingsNotice(message = '', kind = 'error') {
    els.serviceSettingsState.textContent = message;
    els.serviceSettingsState.classList.toggle('hidden', !message);
    els.serviceSettingsState.classList.toggle('warning', kind === 'warning');
  }

  function applySetup(setup) {
    if (!setup || typeof setup !== 'object') return;
    state.setup = setup;
    if (setup.error) {
      setSettingsNotice(setup.error);
      return;
    }
    if (setup.required) state.setupFlowActive = true;
    if (setup.complete) state.setupFlowActive = false;
    const visible = !setup.complete && (setup.required || state.setupFlowActive);
    els.setupPanel.classList.toggle('hidden', !visible);
    if (visible) $('#settingsAdvanced').open = true;
    if (!visible) {
      els.setupState.textContent = '';
      return;
    }
    els.setupComplete.textContent = setup.can_complete ? '完成初始化' : '保存并完成初始化';
    els.setupState.textContent = setup.can_complete
      ? '模型配置已完整。点击完成初始化后才会记录完成状态；这里不会自动实测外部服务。'
      : '尚未完成初始化。模型后台保持暂停，保存完整配置前不会发出模型请求。';
  }

  function applyLlmSettings(llm = {}) {
    els.settingsBaseUrl.value = llm.base_url || '';
    els.settingsModel.value = llm.model || '';
    els.settingsApiKey.value = '';
    els.settingsApiKey.placeholder = llm.api_key_set
      ? `已配置：${llm.api_key_hint || '****'}（留空不修改）`
      : '未配置';
    els.settingsApiState.textContent = llm.api_key_set ? '密钥已配置' : '密钥未配置';
  }

  function updateTtsModeHint() {
    const mode = els.settingsTtsMode.value;
    if (mode === 'local') {
      els.settingsTtsEndpoint.placeholder = 'http://127.0.0.1:端口/v1/audio/speech';
      els.settingsTtsPrivacy.textContent = '本地模式仅允许 localhost、127.0.0.1 或 ::1；文字不会经 星伴 转发到远程语音服务。';
    } else if (mode === 'cloud') {
      els.settingsTtsEndpoint.placeholder = 'https://服务商/v1/audio/speech';
      els.settingsTtsPrivacy.textContent = '云端非本机服务必须使用 HTTPS；只发送被朗读的文字、音色和语速，不发送人设、记忆或聊天上下文。';
    } else {
      els.settingsTtsEndpoint.placeholder = '完整的 /v1/audio/speech 接口地址';
      els.settingsTtsPrivacy.textContent = '语音服务已关闭；角色音色和自动朗读偏好会保留，但不会发起合成。';
    }
  }

  function applyTtsSettings(tts = {}) {
    state.ttsSettings = {
      mode: tts.mode || 'off',
      endpoint: tts.endpoint || '',
      model: tts.model || '',
      max_chars: Number(tts.max_chars) || 800,
    };
    els.settingsTtsMode.value = state.ttsSettings.mode;
    els.settingsTtsEndpoint.value = state.ttsSettings.endpoint;
    els.settingsTtsModel.value = state.ttsSettings.model;
    els.settingsTtsApiKey.value = '';
    els.settingsTtsApiKey.placeholder = tts.api_key_set
      ? `已配置：${tts.api_key_hint || '****'}（留空不修改）`
      : 'API Key（留空则不修改）';
    const mode = state.ttsSettings.mode;
    els.settingsTtsState.textContent = mode === 'off'
      ? '语音服务已关闭'
      : `${mode === 'local' ? '本地' : '云端'} · ${state.ttsSettings.model || '未配置模型'}${tts.api_key_set ? ' · 密钥已配置' : ''}`;
    updateTtsModeHint();
  }

  function resetDiagnosticTestState(target) {
    const llm = target === 'llm';
    const el = llm ? els.settingsLlmTestState : els.settingsTtsTestState;
    el.classList.remove('success', 'error');
    el.textContent = llm
      ? '只有点击「实测模型」才会使用已保存配置发送一条固定测试消息。'
      : '实测使用已保存配置、固定短句和所填音色；音频不保存，也不依赖角色语音开关。';
  }

  async function loadServiceSettings(generation = null) {
    const seq = ++state.settingsRequestSeq;
    try {
      const res = await apiFetch('/api/settings', { cache: 'no-store' });
      const data = await res.json().catch(() => ({}));
      if (seq !== state.settingsRequestSeq) return null;
      if (generation !== null && generation !== state.wsGeneration) return null;
      if (res.status === 404) {
        state.serviceSettingsSupported = false;
        setSettingsNotice('当前服务端不支持网页设置与初始化向导（404），请升级服务端后重试。', 'warning');
        return null;
      }
      if (res.status === 403) {
        setSettingsNotice('访问令牌缺失或不正确。请先在上方保存令牌，再重新检查初始化状态。');
        if (state.everConnected) revealSettings();
        return null;
      }
      if (!res.ok || !data.ok) {
        const message = data.error || `服务端设置读取失败（HTTP ${res.status}）`;
        setSettingsNotice(message);
        revealSettings();
        loadDiagnostics();
        return null;
      }
      state.serviceSettingsSupported = true;
      setSettingsNotice('');
      applyLlmSettings(data.llm || {});
      applyTtsSettings(data.tts || {});
      applySetup(data.setup);
      if (data.setup?.required && els.settingsMask.classList.contains('hidden')) {
        revealSettings();
        loadDiagnostics();
      }
      return data;
    } catch (e) {
      if (seq === state.settingsRequestSeq &&
          (generation === null || generation === state.wsGeneration)) {
        setSettingsNotice('无法读取服务端设置，请检查本地服务与网络连接后重试。');
      }
      return null;
    }
  }

  function renderDiagnosticsMessage(message, warning = false) {
    const p = document.createElement('p');
    p.className = 'cs-hint diagnostics-empty' + (warning ? ' warning' : '');
    p.textContent = message;
    els.diagnosticsList.replaceChildren(p);
  }

  function renderDiagnostics(checks) {
    const items = Array.isArray(checks) ? checks : [];
    if (!items.length) {
      renderDiagnosticsMessage('服务端没有返回诊断项目。', true);
      return;
    }
    const labels = { ok: '正常', warning: '需注意', error: '异常', idle: '未启用' };
    const nodes = items.map((check) => {
      const status = Object.hasOwn(labels, check?.status) ? check.status : 'warning';
      const card = document.createElement('article');
      card.className = `diagnostic-card ${status}`;
      const head = document.createElement('div');
      head.className = 'diagnostic-card-head';
      const title = document.createElement('strong');
      title.textContent = String(check?.label || check?.id || '诊断项目');
      const badge = document.createElement('span');
      badge.className = `diagnostic-badge ${status}`;
      badge.textContent = labels[status];
      head.append(title, badge);
      const summary = document.createElement('p');
      summary.className = 'diagnostic-summary';
      summary.textContent = String(check?.summary || '暂无状态说明');
      const details = document.createElement('ul');
      details.className = 'diagnostic-details';
      for (const detail of (Array.isArray(check?.details) ? check.details : [])) {
        const li = document.createElement('li');
        li.textContent = String(detail);
        details.appendChild(li);
      }
      card.append(head, summary, details);
      if (check?.test && typeof check.test === 'object') {
        const testedAt = Number(check.test.tested_at) || 0;
        const timeText = testedAt > 0
          ? ` · ${new Date(testedAt * 1000).toLocaleString('zh-CN', { hour12: false })}`
          : '';
        const last = document.createElement('p');
        last.className = 'diagnostic-last-test ' + (check.test.success ? 'success' : 'error');
        last.textContent = `最近实测${check.test.success ? '成功' : '未通过'}${timeText}：${check.test.message || '无结果说明'}`;
        card.appendChild(last);
      }
      return card;
    });
    els.diagnosticsList.replaceChildren(...nodes);
  }

  async function loadDiagnostics() {
    const seq = ++state.diagnosticsRequestSeq;
    els.diagnosticsRefresh.disabled = true;
    renderDiagnosticsMessage('正在检查本地状态；不会请求模型或语音服务…');
    try {
      const res = await apiFetch('/api/diagnostics', { cache: 'no-store' });
      const data = await res.json().catch(() => ({}));
      if (seq !== state.diagnosticsRequestSeq) return null;
      if (res.status === 404) {
        renderDiagnosticsMessage('当前服务端不支持分层诊断（404），请升级服务端后重试。', true);
        return null;
      }
      if (res.status === 403) {
        renderDiagnosticsMessage('需要正确的访问令牌才能查看诊断。', true);
        return null;
      }
      if (!res.ok || !data.ok) {
        renderDiagnosticsMessage(data.error || `本地诊断失败（HTTP ${res.status}）`, true);
        return null;
      }
      applySetup(data.setup);
      renderDiagnostics(data.checks);
      return data;
    } catch (e) {
      if (seq === state.diagnosticsRequestSeq) {
        renderDiagnosticsMessage('无法完成本地诊断，请检查本地服务与网络连接。', true);
      }
      return null;
    } finally {
      if (seq === state.diagnosticsRequestSeq) els.diagnosticsRefresh.disabled = false;
    }
  }

  async function runDiagnosticTest(target) {
    const llm = target === 'llm';
    if (!llm && target !== 'tts') return;
    const button = llm ? els.settingsLlmTest : els.settingsTtsTest;
    const result = llm ? els.settingsLlmTestState : els.settingsTtsTestState;
    if (button.disabled) return;
    const body = { target };
    if (!llm) {
      const voiceId = els.settingsTtsVoice.value.trim();
      if (!voiceId) {
        result.classList.remove('success');
        result.classList.add('error');
        result.textContent = '请先填写用于本次实测的音色 ID。';
        els.settingsTtsVoice.focus();
        return;
      }
      if (voiceId.length > 120) {
        result.classList.remove('success');
        result.classList.add('error');
        result.textContent = '音色 ID 不能超过 120 个字符。';
        return;
      }
      body.voice_id = voiceId;
    }
    button.disabled = true;
    result.classList.remove('success', 'error');
    result.textContent = llm
      ? '正在向已保存的模型地址发送固定测试消息…'
      : '正在向已保存的语音地址发送固定短句，测试音频不会保存…';
    try {
      const res = await apiFetch('/api/diagnostics/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const out = await res.json().catch(() => ({}));
      if (!res.ok || !out.ok) throw new Error(out.error || ('HTTP ' + res.status));
      result.classList.toggle('success', out.success === true);
      result.classList.toggle('error', out.success !== true);
      result.textContent = out.message || (out.success ? '实测成功' : '实测未通过');
      loadDiagnostics();
      return out;
    } catch (e) {
      result.classList.remove('success');
      result.classList.add('error');
      result.textContent = '实测请求失败：' + (e?.message || e);
      return null;
    } finally {
      button.disabled = false;
    }
  }

  async function saveLlmSettings(options = {}) {
    const llm = {
      base_url: els.settingsBaseUrl.value.trim(),
      model: els.settingsModel.value.trim(),
    };
    const key = els.settingsApiKey.value.trim();
    if (key) llm.api_key = key;
    if (!llm.base_url && !llm.model && !key) {
      toast('没有要保存的内容');
      return null;
    }
    els.settingsLlmSave.disabled = true;
    try {
      const res = await apiFetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ llm }),
      });
      const out = await res.json().catch(() => ({}));
      if (!res.ok || !out.ok) throw new Error(out.error || ('HTTP ' + res.status));
      applyLlmSettings(out.llm || llm);
      applySetup(out.setup);
      resetDiagnosticTestState('llm');
      setSettingsNotice('');
      if (options.notify !== false) toast('模型设置已保存');
      if (options.refreshDiagnostics !== false &&
          !els.settingsMask.classList.contains('hidden')) loadDiagnostics();
      return out;
    } catch (e) {
      toast('保存失败：' + (e?.message || e));
      return null;
    } finally {
      els.settingsLlmSave.disabled = false;
    }
  }

  async function completeSetupFlow() {
    if (els.setupComplete.disabled) return;
    els.setupComplete.disabled = true;
    els.setupState.textContent = '正在保存模型设置；不会自动请求外部模型…';
    try {
      const saved = await saveLlmSettings({ notify: false, refreshDiagnostics: false });
      if (!saved) {
        els.setupState.textContent = '模型设置尚未保存，请检查上方输入和提示后重试。';
        return null;
      }
      els.setupState.textContent = '模型设置已保存，正在记录初始化完成状态…';
      const res = await apiFetch('/api/setup/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{}',
      });
      const out = await res.json().catch(() => ({}));
      if (!res.ok || !out.ok) throw new Error(out.error || ('HTTP ' + res.status));
      applySetup(out.setup);
      setSettingsNotice('');
      toast('初始化已完成，模型后台已按本地配置启动');
      if (!els.settingsMask.classList.contains('hidden')) loadDiagnostics();
      return out;
    } catch (e) {
      const message = '初始化未完成：' + (e?.message || e);
      els.setupState.textContent = message;
      setSettingsNotice(message);
      return null;
    } finally {
      els.setupComplete.disabled = false;
    }
  }

  async function saveTtsSettings() {
    const tts = {
      mode: els.settingsTtsMode.value,
      endpoint: els.settingsTtsEndpoint.value.trim(),
      model: els.settingsTtsModel.value.trim(),
    };
    const key = els.settingsTtsApiKey.value.trim();
    if (key) tts.api_key = key;
    els.settingsTtsSave.disabled = true;
    try {
      const res = await apiFetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tts }),
      });
      const out = await res.json().catch(() => ({}));
      if (!res.ok || !out.ok) throw new Error(out.error || ('HTTP ' + res.status));
      stopSpeech({ clearQueue: true, clearCache: true });
      applyTtsSettings(out.tts || tts);
      applySetup(out.setup);
      resetDiagnosticTestState('tts');
      setSettingsNotice('');
      toast('语音服务设置已保存');
      if (!els.settingsMask.classList.contains('hidden')) loadDiagnostics();
      return out;
    } catch (e) {
      toast('保存失败：' + (e?.message || e));
      return null;
    } finally {
      els.settingsTtsSave.disabled = false;
    }
  }

  async function downloadBackup() {
    if (els.settingsBackup.disabled) return;
    els.settingsBackup.disabled = true;
    els.settingsBackup.textContent = '正在备份…';
    let objectUrl = '';
    try {
      const res = await apiFetch('/api/backup', { cache: 'no-store' });
      if (!res.ok) {
        const out = await res.json().catch(() => ({}));
        throw new Error(out.error || ('HTTP ' + res.status));
      }
      const disposition = res.headers.get('Content-Disposition') || '';
      const encoded = disposition.match(/filename\*=UTF-8''([^;]+)/i);
      const plain = disposition.match(/filename="?([^";]+)"?/i);
      let filename = 'companion-backup.zip';
      try {
        filename = encoded ? decodeURIComponent(encoded[1]) :
          (plain ? plain[1] : filename);
      } catch (e) { /* 保留安全默认文件名 */ }
      const blob = await res.blob();
      objectUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = filename;
      link.hidden = true;
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast('备份已下载，请妥善保管');
    } catch (e) {
      toast('备份失败：' + (e?.message || e));
    } finally {
      if (objectUrl) setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
      els.settingsBackup.disabled = false;
      els.settingsBackup.textContent = '下载备份';
    }
  }

  // ---------------------------------------------------------- 角色卡草稿 / 创建前试聊
  async function characterCardRequest(path, options = {}) {
    const headers = { ...(options.headers || {}) };
    if (options.body) headers['Content-Type'] = 'application/json';
    const res = await apiFetch(path, { ...options, headers });
    const out = await res.json().catch(() => ({}));
    if (!res.ok || !out.ok) {
      const error = new Error(out.error || ('HTTP ' + res.status));
      error.status = res.status;
      throw error;
    }
    return out;
  }

  function setCharacterStatus(text, busy = false) {
    els.characterStatus.textContent = text;
    els.characterStatus.classList.toggle('busy', busy);
  }

  function syncCharacterControls() {
    const busy = !!state.characterBusy;
    const hasDraft = !!state.characterDraft;
    for (const el of [els.characterPickAvatar, els.characterImport, els.characterGenerate,
      els.characterName, els.characterSeries, els.characterAliases, els.characterSummary,
      els.characterInterests, els.characterPersona, els.characterTrialInput]) {
      el.disabled = busy;
    }
    els.characterSaveDraft.disabled = busy || !hasDraft || !state.characterDraftDirty;
    els.characterTrialSend.disabled = busy || !hasDraft;
    els.characterCreate.disabled = busy || !hasDraft;
    els.characterGenerate.textContent = state.characterBusy === 'generate'
      ? '正在联网蒸馏…' : '联网生成草稿';
    els.characterImport.textContent = state.characterBusy === 'import'
      ? '正在导入…' : '导入 JSON 角色卡';
    els.characterSaveDraft.textContent = state.characterBusy === 'save'
      ? '保存中…' : '保存修改';
    els.characterTrialSend.textContent = state.characterBusy === 'chat'
      ? '等待回复…' : '发送';
    els.characterCreate.textContent = state.characterBusy === 'commit'
      ? '正在正式添加…' : '确认添加角色';
  }

  function setCharacterBusy(kind, message = '') {
    state.characterBusy = kind;
    if (message) setCharacterStatus(message, true);
    syncCharacterControls();
  }

  function renderCharacterAvatar() {
    const avatar = state.pendingCharacterAvatar;
    els.characterPreview.innerHTML = '';
    els.characterPreview.classList.toggle('has-img', !!avatar);
    if (avatar) {
      const img = document.createElement('img');
      img.alt = '头像预览';
      img.src = avatar;
      els.characterPreview.appendChild(img);
    } else {
      const span = document.createElement('span');
      span.textContent = '?';
      els.characterPreview.appendChild(span);
    }
  }

  function resetCharacterModal() {
    state.pendingCharacterAvatar = '';
    state.characterDraft = null;
    state.characterDraftDirty = false;
    state.characterBusy = '';
    state.characterTrial = [];
    for (const el of [els.characterName, els.characterSeries, els.characterAliases,
      els.characterSummary, els.characterInterests, els.characterPersona,
      els.characterTrialInput]) el.value = '';
    els.characterAvatarInput.value = '';
    els.characterCardInput.value = '';
    els.characterEditor.classList.add('hidden');
    setCharacterStatus('草稿与试聊不会写入正式角色、聊天或记忆。');
    renderCharacterAvatar();
    renderCharacterTrial();
    syncCharacterControls();
  }

  function openCharacterModal() {
    els.settingsMask.classList.add('hidden');
    state.characterRequestSeq += 1;
    resetCharacterModal();
    els.characterMask.classList.remove('hidden');
    setTimeout(() => els.characterName.focus(), 40);
  }

  function closeCharacterModal() {
    state.characterRequestSeq += 1;
    els.characterMask.classList.add('hidden');
    resetCharacterModal();
  }

  function pickCharacterAvatar() {
    els.characterAvatarInput.value = '';
    els.characterAvatarInput.click();
  }

  function markCharacterDirty() {
    if (!state.characterDraft) return;
    state.characterDraftDirty = true;
    els.characterRevision.textContent =
      `草稿 revision ${state.characterDraft.revision} · 有未保存修改`;
    syncCharacterControls();
  }

  function previewCharacterAvatar(file) {
    if (!file) return;
    if (!/^image\//.test(file.type || '')) { toast('请选择图片文件'); return; }
    if (file.size > 8 * 1024 * 1024) { toast('头像太大（上限 8MB）'); return; }
    const seq = state.characterRequestSeq;
    const reader = new FileReader();
    reader.onload = () => {
      if (seq !== state.characterRequestSeq) return;
      state.pendingCharacterAvatar = String(reader.result || '');
      renderCharacterAvatar();
      markCharacterDirty();
      if (state.characterDraft) setCharacterStatus('头像已更换，保存修改后才会用于正式添加。');
    };
    reader.readAsDataURL(file);
  }

  function splitCharacterList(value) {
    return String(value || '').split(/[、，,\n]/).map((x) => x.trim())
      .filter(Boolean).slice(0, 8);
  }

  function renderCharacterTrial() {
    els.characterTrialLog.textContent = '';
    if (!state.characterTrial.length) {
      const empty = document.createElement('div');
      empty.className = 'character-trial-empty';
      empty.textContent = '先说一句你好，看看她的语气是否合适。';
      els.characterTrialLog.appendChild(empty);
      return;
    }
    for (const turn of state.characterTrial) {
      const row = document.createElement('div');
      row.className = `character-trial-row ${turn.role === 'user' ? 'from-user' : 'from-character'}`;
      const bubble = document.createElement('div');
      bubble.className = 'character-trial-bubble';
      bubble.textContent = String(turn.text || '');
      row.appendChild(bubble);
      els.characterTrialLog.appendChild(row);
    }
    els.characterTrialLog.scrollTop = els.characterTrialLog.scrollHeight;
  }

  function applyCharacterDraft(draft) {
    state.characterDraft = { ...draft };
    state.characterDraftDirty = false;
    if (draft.avatar) state.pendingCharacterAvatar = draft.avatar;
    els.characterName.value = draft.name || '';
    els.characterSeries.value = draft.series || '';
    els.characterAliases.value = (draft.aliases || []).join('、');
    els.characterSummary.value = draft.summary || '';
    els.characterInterests.value = (draft.interests || []).join('、');
    els.characterPersona.value = draft.persona_md || '';
    els.characterRevision.textContent = `草稿 revision ${draft.revision}`;
    els.characterEditor.classList.remove('hidden');
    state.characterTrial = [];
    renderCharacterAvatar();
    renderCharacterTrial();
    syncCharacterControls();
  }

  function characterDraftChanges() {
    return {
      name: els.characterName.value.trim(),
      series: els.characterSeries.value.trim(),
      aliases: splitCharacterList(els.characterAliases.value),
      summary: els.characterSummary.value.trim(),
      persona_md: els.characterPersona.value.trim(),
      interests: splitCharacterList(els.characterInterests.value),
      avatar: state.pendingCharacterAvatar,
    };
  }

  async function saveCharacterDraft({ quiet = false } = {}) {
    const draft = state.characterDraft;
    if (!draft || !state.characterDraftDirty) return draft;
    const seq = state.characterRequestSeq;
    if (!quiet) setCharacterBusy('save', '正在保存草稿修改…');
    try {
      const out = await characterCardRequest('/api/character-drafts', {
        method: 'PATCH',
        body: JSON.stringify({ draft_id: draft.id, revision: draft.revision,
          ...characterDraftChanges() }),
      });
      if (seq !== state.characterRequestSeq) throw new Error('草稿面板已关闭');
      applyCharacterDraft(out.draft);
      if (!quiet) setCharacterStatus('修改已保存；试聊上下文已按新人设重新开始。');
      return out.draft;
    } catch (e) {
      if (!quiet && seq === state.characterRequestSeq) setCharacterStatus(e.message || '保存失败');
      throw e;
    } finally {
      if (!quiet && seq === state.characterRequestSeq) setCharacterBusy('');
    }
  }

  async function generateCharacterDraft() {
    if (state.characterBusy) return;
    const name = els.characterName.value.trim();
    if (!name) {
      setCharacterStatus('请先填写角色名。');
      els.characterName.focus();
      return;
    }
    const seq = state.characterRequestSeq;
    setCharacterBusy('generate', '正在搜索资料、提炼性格与口癖；此阶段不会创建正式角色。');
    try {
      const out = await characterCardRequest('/api/character-drafts/generate', {
        method: 'POST',
        body: JSON.stringify({ name, avatar: state.pendingCharacterAvatar }),
      });
      if (seq !== state.characterRequestSeq) return;
      applyCharacterDraft(out.draft);
      setCharacterStatus('草稿已生成。可以修改人设、先试聊，再决定是否正式添加。');
    } catch (e) {
      if (seq === state.characterRequestSeq) setCharacterStatus(e.message || '生成失败，请重试');
    } finally {
      if (seq === state.characterRequestSeq) setCharacterBusy('');
    }
  }

  async function importCharacterDraft(file) {
    if (state.characterBusy || !file) return;
    if (file.size > 12 * 1024 * 1024) {
      setCharacterStatus('角色卡文件太大（上限 12MB）。');
      return;
    }
    const seq = state.characterRequestSeq;
    setCharacterBusy('import', '正在校验角色卡版本、字段和本地头像…');
    try {
      const card = JSON.parse(await file.text());
      const out = await characterCardRequest('/api/character-drafts/import', {
        method: 'POST',
        body: JSON.stringify({ card, avatar: state.pendingCharacterAvatar }),
      });
      if (seq !== state.characterRequestSeq) return;
      applyCharacterDraft(out.draft);
      setCharacterStatus('角色卡已导入为草稿；卡内 ID、目录和外部 URL 不会被采用。');
    } catch (e) {
      if (seq === state.characterRequestSeq) {
        setCharacterStatus(e instanceof SyntaxError ? 'JSON 格式错误，请检查角色卡文件。' : e.message);
      }
    } finally {
      if (seq === state.characterRequestSeq) setCharacterBusy('');
    }
  }

  async function sendCharacterTrial() {
    if (state.characterBusy || !state.characterDraft) return;
    const text = els.characterTrialInput.value.trim();
    if (!text) return;
    const seq = state.characterRequestSeq;
    setCharacterBusy('chat', '正在准备独立试聊上下文…');
    try {
      await saveCharacterDraft({ quiet: true });
      if (seq !== state.characterRequestSeq) return;
      setCharacterBusy('chat', '她正在回复；不会保存记忆、画像或情绪。');
      const draft = state.characterDraft;
      const out = await characterCardRequest('/api/character-drafts/chat', {
        method: 'POST',
        body: JSON.stringify({ draft_id: draft.id, revision: draft.revision, text }),
      });
      if (seq !== state.characterRequestSeq) return;
      state.characterTrial = Array.isArray(out.trial) ? out.trial : [];
      els.characterTrialInput.value = '';
      renderCharacterTrial();
      setCharacterStatus('这段试聊只用于当前草稿，不会出现在正式聊天记录中。');
    } catch (e) {
      if (seq === state.characterRequestSeq) setCharacterStatus(e.message || '试聊失败，请重试');
    } finally {
      if (seq === state.characterRequestSeq) setCharacterBusy('');
    }
  }

  async function createCharacter() {
    if (state.characterBusy || !state.characterDraft) return;
    const seq = state.characterRequestSeq;
    setCharacterBusy('commit', '正在校验并正式写入角色数据…');
    try {
      await saveCharacterDraft({ quiet: true });
      if (!state.pendingCharacterAvatar) throw new Error('正式添加前请选择头像');
      const draft = state.characterDraft;
      const out = await characterCardRequest('/api/character-drafts/commit', {
        method: 'POST',
        body: JSON.stringify({ draft_id: draft.id, revision: draft.revision }),
      });
      if (seq !== state.characterRequestSeq) return;
      const ch = out.character || {};
      const cid = Number(ch.id || 0);
      if (cid && !state.characters.some((c) => String(c.id) === String(cid))) {
        state.characters.push({ id: cid, name: ch.name || draft.name, series: ch.series || '' });
      }
      if (cid) {
        state.charMsgs[cid] = state.charMsgs[cid] || [];
        convMetaFor(cid);
      }
      closeCharacterModal();
      await loadAvatars();
      renderConvList();
      renderContactList();
      if (cid) {
        await loadVoiceConfig(cid);
        selectCharacter(cid);
      }
      toast(`「${ch.name || draft.name}」已正式添加`);
    } catch (e) {
      if (seq === state.characterRequestSeq) setCharacterStatus(e.message || '添加失败，请重试');
    } finally {
      if (seq === state.characterRequestSeq) setCharacterBusy('');
    }
  }

  els.railSettings.addEventListener('click', openSettings);
  els.mobileSettings.addEventListener('click', openSettings);
  els.mobileTheme.addEventListener('click', () => {
    setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
  });
  els.settingsClose.addEventListener('click', () => els.settingsMask.classList.add('hidden'));
  els.settingsMask.addEventListener('click', (e) => {
    if (e.target === els.settingsMask) els.settingsMask.classList.add('hidden');
  });
  els.settingsReconnect.addEventListener('click', () => {
    els.settingsMask.classList.add('hidden');
    reconnectNow();
  });
  els.settingsStapxs.addEventListener('click', () => window.open('/stapxs/', '_blank'));
  els.setupComplete.addEventListener('click', completeSetupFlow);
  els.settingsLlmSave.addEventListener('click', () => saveLlmSettings());
  els.settingsLlmTest.addEventListener('click', () => runDiagnosticTest('llm'));
  els.diagnosticsRefresh.addEventListener('click', loadDiagnostics);
  els.settingsApiKey.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); saveLlmSettings(); }
  });
  els.settingsTtsSave.addEventListener('click', saveTtsSettings);
  els.settingsTtsTest.addEventListener('click', () => runDiagnosticTest('tts'));
  els.settingsTtsMode.addEventListener('change', () => {
    updateTtsModeHint();
    els.settingsTtsState.textContent = '有尚未保存的语音服务修改';
  });
  els.settingsTtsApiKey.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); saveTtsSettings(); }
  });
  els.settingsAddCharacter.addEventListener('click', openCharacterModal);
  els.settingsBackup.addEventListener('click', downloadBackup);
  els.characterClose.addEventListener('click', closeCharacterModal);
  els.characterCancel.addEventListener('click', closeCharacterModal);
  els.characterMask.addEventListener('click', (e) => {
    if (e.target === els.characterMask) closeCharacterModal();
  });
  els.characterPickAvatar.addEventListener('click', pickCharacterAvatar);
  els.characterAvatarInput.addEventListener('change', () => {
    const f = els.characterAvatarInput.files && els.characterAvatarInput.files[0];
    if (f) previewCharacterAvatar(f);
  });
  els.characterImport.addEventListener('click', () => {
    els.characterCardInput.value = '';
    els.characterCardInput.click();
  });
  els.characterCardInput.addEventListener('change', () => {
    const f = els.characterCardInput.files && els.characterCardInput.files[0];
    els.characterCardInput.value = '';
    if (f) importCharacterDraft(f);
  });
  els.characterGenerate.addEventListener('click', generateCharacterDraft);
  els.characterSaveDraft.addEventListener('click', () => {
    saveCharacterDraft().catch(() => {});
  });
  els.characterTrialSend.addEventListener('click', sendCharacterTrial);
  els.characterTrialInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendCharacterTrial();
    }
  });
  for (const el of [els.characterName, els.characterSeries, els.characterAliases,
    els.characterSummary, els.characterInterests, els.characterPersona]) {
    el.addEventListener('input', markCharacterDirty);
  }
  els.characterCreate.addEventListener('click', createCharacter);
  els.characterName.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !state.characterDraft) {
      e.preventDefault();
      generateCharacterDraft();
    }
  });

  // ---------------------------------------------------------- 更换头像（QQ 式裁剪）
  const AVATAR_PX = 256;

  function closeAvatarCrop() {
    els.avatarMask.classList.add('hidden');
    const c = state.avatarCrop;
    if (c && c.url) URL.revokeObjectURL(c.url);
    state.avatarCrop = null;
    // 目标也要清掉：否则下一次换别人头像时会误用上一次的目标（比如把群里
    // 的头像存到某个角色身上）
    state.avatarTarget = null;
    els.avatarCropImg.removeAttribute('src');
    els.avatarCropImg.removeAttribute('style');
  }

  function startAvatarCrop(file) {
    if (!file) return;
    if (!/^image\//.test(file.type || '')) { toast('请选择图片文件'); return; }
    if (file.size > 12 * 1024 * 1024) { toast('图片太大（上限 12MB）'); return; }
    const old = state.avatarCrop;
    if (old && old.url) URL.revokeObjectURL(old.url);
    state.avatarCrop = null;

    const url = URL.createObjectURL(file);
    // 先显示弹窗，才能量到裁剪框的真实尺寸
    els.avatarMask.classList.remove('hidden');
    els.avatarZoom.value = '100';

    const img = new Image();
    img.onload = () => {
      const stage = els.avatarStage;
      state.avatarCrop = {
        url,
        img,
        stageW: stage.clientWidth || 280,
        stageH: stage.clientHeight || 280,
        base: 1,
        zoom: 1,
        x: 0,
        y: 0,
      };
      els.avatarCropImg.src = url;
      layoutAvatarCrop();
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      els.avatarMask.classList.add('hidden');
      toast('图片读取失败');
    };
    img.src = url;
  }

  function layoutAvatarCrop() {
    const c = state.avatarCrop;
    if (!c) return;
    const stage = els.avatarStage;
    const w = stage.clientWidth;
    const h = stage.clientHeight;
    if (w && h) { c.stageW = w; c.stageH = h; }
    const iw = c.img.naturalWidth || 1;
    const ih = c.img.naturalHeight || 1;
    // base = 刚好铺满裁剪框的缩放；zoom 只在此基础上放大
    c.base = Math.max(c.stageW / iw, c.stageH / ih) || 1;
    const scale = c.base * c.zoom;
    const dw = iw * scale;
    const dh = ih * scale;
    const maxX = Math.max(0, (dw - c.stageW) / 2);
    const maxY = Math.max(0, (dh - c.stageH) / 2);
    c.x = Math.max(-maxX, Math.min(maxX, c.x));
    c.y = Math.max(-maxY, Math.min(maxY, c.y));
    const el = els.avatarCropImg;
    el.style.width = dw + 'px';
    el.style.height = dh + 'px';
    el.style.left = (c.stageW / 2 + c.x - dw / 2) + 'px';
    el.style.top = (c.stageH / 2 + c.y - dh / 2) + 'px';
  }

  function setAvatarZoom(z) {
    const c = state.avatarCrop;
    if (!c) return;
    c.zoom = Math.max(1, Math.min(4, z));
    els.avatarZoom.value = String(Math.round(c.zoom * 100));
    layoutAvatarCrop();
  }

  function confirmAvatarCrop() {
    const c = state.avatarCrop;
    if (!c) return;
    const scale = c.base * c.zoom;
    const dw = c.img.naturalWidth * scale;
    const left = c.stageW / 2 + c.x - dw / 2;
    const side = c.stageW / scale;
    const sx = -left / scale;
    const sy = -((c.stageH / 2 + c.y - c.img.naturalHeight * scale / 2) / scale);

    const canvas = document.createElement('canvas');
    canvas.width = AVATAR_PX;
    canvas.height = AVATAR_PX;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, AVATAR_PX, AVATAR_PX);
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(c.img, sx, sy, side, side, 0, 0, AVATAR_PX, AVATAR_PX);
    saveAvatar(canvas.toDataURL('image/png'));
  }

  async function saveAvatar(dataUrl) {
    const tgt = state.avatarTarget;
    const isGrp = !!(tgt && tgt.kind === 'group');
    const key = isGrp ? ('g' + tgt.id) : String(state.bot.id);
    try {
      const res = await apiFetch('/api/avatar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ peer_id: key, data: dataUrl }),
      });
      const out = await res.json().catch(() => ({}));
      if (!res.ok || !out.ok) throw new Error(out.error || ('HTTP ' + res.status));
      state.avatars[key] = out.url ||
        `/api/avatar?peer_id=${encodeURIComponent(key)}&v=${Date.now()}`;
      closeAvatarCrop();
      state.avatarTarget = null;
      if (isGrp) {
        renderGroupSide();
        renderConvList();
        renderContactList();
        toast('群头像已更新');
      } else {
        refreshBotAvatars();
        applyFavicon();
        toast('头像已更新');
      }
    } catch (e) {
      toast('头像保存失败：' + (e?.message || e));
    }
  }

  async function resetAvatar() {
    if (!state.bot.id) return;
    const tgt = state.avatarTarget;
    const isGrp = !!(tgt && tgt.kind === 'group');
    const key = isGrp ? ('g' + tgt.id) : String(state.bot.id);
    try {
      const res = await apiFetch('/api/avatar/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ peer_id: key }),
      });
      const out = await res.json().catch(() => ({}));
      if (!res.ok || !out.ok) throw new Error(out.error || ('HTTP ' + res.status));
      delete state.avatars[key];
      state.avatarTarget = null;
      // 新增角色会恢复成导入时的原头像；星野会回到 QQ 头像
      await loadAvatars();
      if (isGrp) { renderGroupSide(); renderConvList(); renderContactList(); }
      else { refreshBotAvatars(); applyFavicon(); }
      toast('已恢复默认头像');
    } catch (e) {
      toast('恢复失败：' + (e?.message || e));
    }
  }

  function openAvatarPicker() {
    state.avatarTarget = { kind: 'peer', id: state.bot.id };
    els.avatarFileInput.value = '';
    els.avatarFileInput.click();
  }

  els.csAvatarPick.addEventListener('click', openAvatarPicker);
  els.csAvatarPreview.addEventListener('click', openAvatarPicker);
  els.csAvatar.addEventListener('click', openAvatarPicker);
  els.csAvatar.title = '点击更换头像';
  els.csAvatarReset.addEventListener('click', () => {
    state.avatarTarget = { kind: 'peer', id: state.bot.id };
    resetAvatar();
  });
  els.avatarClose.addEventListener('click', closeAvatarCrop);
  els.avatarCancel.addEventListener('click', closeAvatarCrop);
  els.avatarMask.addEventListener('click', (e) => {
    if (e.target === els.avatarMask) closeAvatarCrop();
  });
  // 「重新选择」只重开文件框，**不要**重置 avatarTarget —— 否则换群头像时点它
  // 会把目标换回上一个私聊角色，最后存到角色身上去了
  els.avatarRepick.addEventListener('click', () => {
    els.avatarFileInput.value = '';
    els.avatarFileInput.click();
  });
  els.avatarConfirm.addEventListener('click', confirmAvatarCrop);
  els.avatarFileInput.addEventListener('change', () => {
    const f = els.avatarFileInput.files && els.avatarFileInput.files[0];
    if (f) startAvatarCrop(f);
  });
  els.avatarZoom.addEventListener('input', () => {
    setAvatarZoom(Number(els.avatarZoom.value) / 100);
  });
  window.addEventListener('resize', () => {
    if (state.avatarCrop) layoutAvatarCrop();
    syncVoiceHoldAffordance();
  });

  // 拖动选图：QQ 里按住图片挪位置
  let cropDrag = null;
  els.avatarStage.addEventListener('pointerdown', (e) => {
    const c = state.avatarCrop;
    if (!c) return;
    e.preventDefault();
    cropDrag = { id: e.pointerId, sx: e.clientX, sy: e.clientY, ox: c.x, oy: c.y };
    els.avatarStage.classList.add('dragging');
    try { els.avatarStage.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
  });
  els.avatarStage.addEventListener('pointermove', (e) => {
    const c = state.avatarCrop;
    if (!c || !cropDrag || cropDrag.id !== e.pointerId) return;
    c.x = cropDrag.ox + (e.clientX - cropDrag.sx);
    c.y = cropDrag.oy + (e.clientY - cropDrag.sy);
    layoutAvatarCrop();
  });
  const endCropDrag = (e) => {
    if (!cropDrag || (e && cropDrag.id !== e.pointerId)) return;
    cropDrag = null;
    els.avatarStage.classList.remove('dragging');
  };
  els.avatarStage.addEventListener('pointerup', endCropDrag);
  els.avatarStage.addEventListener('pointercancel', endCropDrag);
  els.avatarStage.addEventListener('wheel', (e) => {
    if (!state.avatarCrop) return;
    e.preventDefault();
    setAvatarZoom(state.avatarCrop.zoom * (e.deltaY < 0 ? 1.12 : 1 / 1.12));
  }, { passive: false });

  // ---------------------------------------------------------- 聊天设置（按对话）
  function openChatSettings() {
    applyChatSettingsIdentity();   // 打开前再同步一次，绝不显示上一个角色
    ensureChatTheme(themeKey());
    state.chatSide = 'in';
    els.chatSettingsMask.classList.remove('hidden');
    renderChatSettings();
    setVoiceControls(state.voiceConfigs[String(state.bot.id)] || {});
    loadTraits();
    if (!state.stickers) loadStickers();
    else if (!state.stickerSetsLoaded) loadStickerSets();
  }

  function closeChatSettings() {
    els.chatSettingsMask.classList.add('hidden');
  }

  // ---------------------------------------------------------- 关系参数
  // 与后端 traits.py 保持一致：热情影响已放大 4 倍
  const TRAIT_SESSION_POINTS = [[0, 0.32], [10, 2.00], [25, 3.76], [50, 4.92],
    [75, 6.48], [90, 8.16], [100, 16.40]];
  const TRAIT_REPLY_POINTS = [[0, 37.5], [10, 17.5], [25, 11.25], [50, 6],
    [75, 5], [90, 4], [100, 3]];

  function traitInterp(points, x) {
    const v = Math.max(points[0][0], Math.min(points[points.length - 1][0], Number(x)));
    for (let i = 1; i < points.length; i++) {
      const [x0, y0] = points[i - 1];
      const [x1, y1] = points[i];
      if (v <= x1) {
        if (x1 === x0) return y1;
        return y0 + (y1 - y0) * (v - x0) / (x1 - x0);
      }
    }
    return points[points.length - 1][1];
  }

  function quietDeadline(until) {
    const value = Number(until);
    return Number.isFinite(value) && value > Date.now() / 1000 ? value : 0;
  }

  function quietTimeText(until) {
    return new Date(until * 1000).toLocaleString('zh-CN', {
      month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  }

  function updateQuietHint() {
    const selected = els.csQuietFor.value;
    if (selected === 'current') {
      const until = Number(els.csQuietFor.dataset.currentUntil) || 0;
      els.csQuietStatus.textContent = until
        ? `将于 ${quietTimeText(until)} 恢复主动；你发消息时，她仍会正常回复。`
        : '只暂停她主动找你；你发消息时，她仍会正常回复。';
    } else if (Number(selected) > 0) {
      els.csQuietStatus.textContent =
        `保存后安静 ${selected} 小时；只暂停主动行为，不影响正常回复。`;
    } else {
      els.csQuietStatus.textContent = '只暂停她主动找你；你发消息时，她仍会正常回复。';
    }
  }

  function setQuietControl(until) {
    const select = els.csQuietFor;
    select.querySelector('option[data-current]')?.remove();
    const activeUntil = quietDeadline(until);
    select.dataset.currentUntil = String(activeUntil);
    if (activeUntil) {
      const option = document.createElement('option');
      option.value = 'current';
      option.dataset.current = '1';
      option.textContent = `保持当前（至 ${quietTimeText(activeUntil)}）`;
      select.prepend(option);
      select.value = 'current';
    } else {
      select.value = '0';
    }
    updateQuietHint();
  }

  function updateTraitPreview() {
    const e = Number(els.csEnthusiasm.value);
    const af = Number(els.csAffection.value);
    const scale = Math.max(0, Math.min(2, Number(els.csInitiativeScale.value) || 0));
    els.csEnthusiasmVal.textContent = String(e);
    els.csAffectionVal.textContent = String(af);
    els.csInitiativeScaleVal.textContent = scale === 0 ? '关闭' : `${Math.round(scale * 100)}%`;
    // 与 traits.py 一致：关系曲线再乘每角色主动倍率；0 是硬关闭而非“每天最少一条”。
    const sessions = traitInterp(TRAIT_SESSION_POINTS, e);
    const affMult = 0.7 + (af / 100) * 0.9;
    const rawDaily = Math.round(sessions * 3 * affMult * 1.4 * scale);
    const daily = rawDaily > 0 && e > 0 ? Math.max(1, Math.min(200, rawDaily)) : 0;
    const reply = Math.max(1, traitInterp(TRAIT_REPLY_POINTS, e) / 3);
    els.csTraitPreview.textContent = scale === 0
      ? `实际生效：主动已关闭 · 回复约 ${reply.toFixed(1)} 秒`
      : `实际生效：主动约 ${daily} 条/天 · 回复约 ${reply.toFixed(1)} 秒`;
    if (els.csTraitDetail) {
      if (scale === 0) {
        els.csTraitDetail.textContent = '主动开口、补话和话题重启均已暂停；你发消息后的直接回复不受影响。';
        return;
      }
      const active = Math.round((8 + (af / 100) * 72) * 3);
      const minGap = Math.max(4, Math.round(
        traitInterp([[0, 180], [25, 60], [50, 30], [75, 22], [90, 15], [100, 8]], e) / 3 / scale));
      const maxGap = Math.max(30, Math.min(2880,
        Math.round(1440 / Math.max(1, sessions * 3 * affMult) * 1.2 / scale)));
      const follow = Math.max(1, Math.min(24,
        Math.round((1 + (af / 100) * 7) * 3)));
      const burst = Math.max(2, Math.min(12,
        Math.round(2 + (e / 100) * 4 + (af / 100) * 4)));
      els.csTraitDetail.textContent =
        `两次主动间隔 ≥ ${minGap} 分钟 · 最长沉默 ${maxGap} 分钟\n`
        + `接话窗口 ${active} 分钟 · 每话题最多接 ${follow} 次 · 一次最多 ${burst} 条`;
    }
  }

  function updateVoiceControls() {
    const enabled = els.csVoiceEnabled.checked;
    if (!enabled) els.csVoiceAuto.checked = false;
    els.csVoiceAuto.disabled = !enabled;
    const speed = Number(els.csVoiceSpeed.value) || 1;
    els.csVoiceSpeedVal.textContent = speed.toFixed(1) + '×';
    if (!enabled) {
      els.csVoiceHint.textContent = '先在全局设置中配置语音服务，再启用这个角色的声音。';
    } else if (state.ttsSettings?.mode === 'off') {
      els.csVoiceHint.textContent = '角色语音已启用，但全局语音服务已关闭；开启服务后即可朗读。';
    } else {
      els.csVoiceHint.textContent = els.csVoiceAuto.checked
        ? '当前私聊的新回复会依次朗读；手动点击其他消息会优先播放。'
        : '她的文字消息下方会显示“朗读”；音频按需生成，不写入聊天或备份。';
    }
  }

  function setVoiceControls(value) {
    const voice = normalizeVoice(value);
    els.csVoiceEnabled.checked = voice.enabled;
    els.csVoiceAuto.checked = voice.auto;
    els.csVoiceId.value = voice.voice_id;
    els.csVoiceSpeed.value = String(voice.speed);
    updateVoiceControls();
  }

  async function loadTraits() {
    const peerId = String(state.bot?.id || '');
    if (!peerId) return;
    loadBond();                       // 绑定状态可能被别的端改过
    try {
      const res = await apiFetch(
        `/api/character-traits?peer_id=${encodeURIComponent(peerId)}`,
        { cache: 'no-store' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok || String(state.bot?.id || '') !== peerId) return;
      els.csEnthusiasm.value = data.enthusiasm ?? 50;
      els.csAffection.value = data.affection ?? 60;
      els.csInitiativeScale.value = data.initiative_scale ?? 1;
      els.csLowPressure.checked = data.low_pressure === true;
      setQuietControl(data.quiet_until ?? 0);
      const voice = normalizeVoice(data.voice);
      state.voiceConfigs[peerId] = voice;
      setVoiceControls(voice);
      updateTraitPreview();
    } catch (e) {
      if (String(state.bot?.id || '') === peerId) {
        setVoiceControls(state.voiceConfigs[peerId] || {});
      }
      updateTraitPreview();
    }
  }

  async function saveTraits() {
    const peerId = String(state.bot?.id || '');
    if (!peerId) return;
    const quietChoice = els.csQuietFor.value;
    const quietUntil = quietChoice === 'current'
      ? Number(els.csQuietFor.dataset.currentUntil) || 0
      : Number(quietChoice) > 0
        ? Date.now() / 1000 + Number(quietChoice) * 3600
        : 0;
    els.csTraitSave.disabled = true;
    try {
      const res = await apiFetch('/api/character-traits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          peer_id: peerId,
          enthusiasm: Number(els.csEnthusiasm.value),
          affection: Number(els.csAffection.value),
          initiative_scale: Number(els.csInitiativeScale.value),
          quiet_until: quietUntil,
          low_pressure: els.csLowPressure.checked,
        }),
      });
      const out = await res.json().catch(() => ({}));
      if (!res.ok || !out.ok) throw new Error(out.error || ('HTTP ' + res.status));
      if (String(state.bot?.id || '') === peerId) {
        setQuietControl(out.quiet_until ?? quietUntil);
        updateTraitPreview();
      }
      toast('陪伴设置已保存');
    } catch (e) {
      toast('保存失败：' + (e?.message || e));
    } finally {
      els.csTraitSave.disabled = false;
    }
  }

  async function saveVoiceSettings() {
    const peerId = String(state.bot?.id || '');
    if (!peerId) return;
    const voice = {
      enabled: els.csVoiceEnabled.checked,
      auto: els.csVoiceAuto.checked,
      voice_id: els.csVoiceId.value.trim(),
      speed: Number(els.csVoiceSpeed.value),
    };
    if (voice.enabled && !voice.voice_id) {
      toast('启用角色语音前，请填写音色 ID');
      els.csVoiceId.focus();
      return;
    }
    els.csVoiceSave.disabled = true;
    try {
      const res = await apiFetch('/api/character-traits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ peer_id: peerId, voice }),
      });
      const out = await res.json().catch(() => ({}));
      if (!res.ok || !out.ok) throw new Error(out.error || ('HTTP ' + res.status));
      const saved = normalizeVoice(out.voice || voice);
      state.voiceConfigs[peerId] = saved;
      if (state.speech.current?.peerId === peerId) {
        stopSpeech({ clearQueue: true, clearCache: true });
      } else if (state.speech.cache?.key.startsWith(peerId + ':')) {
        clearSpeechCache();
      }
      if (!isGroup() && String(state.bot?.id || '') === peerId) {
        setVoiceControls(saved);
        renderAll(false);
      }
      toast('角色语音设置已保存');
    } catch (e) {
      toast('保存失败：' + (e?.message || e));
    } finally {
      els.csVoiceSave.disabled = false;
    }
  }

  function chip(label, active, onClick) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip' + (active ? ' active' : '');
    b.textContent = label;
    b.addEventListener('click', onClick);
    return b;
  }

  function renderChatSettings() {
    if (!els.csStyles) return;
    const theme = editTheme();
    renderChatBackgroundSettings();

    els.csSideSeg.querySelectorAll('button').forEach((b) => {
      b.classList.toggle('active', b.dataset.side === state.chatSide);
    });

    // 样式
    els.csStyles.innerHTML = '';
    for (const s of BUBBLE_STYLES) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'bubble-opt' + (s.id === theme.style ? ' active' : '');
      const mini = document.createElement('span');
      mini.className = 'mini mini-' + s.id;
      const label = document.createElement('span');
      label.textContent = s.name;
      b.append(mini, label);
      b.addEventListener('click', () => {
        theme.style = s.id;
        saveChatThemes();
        applyChatTheme();
        renderChatSettings();
      });
      els.csStyles.appendChild(b);
    }

    // 自定义颜色
    els.csCustom.checked = !!theme.custom;
    els.csBg1.value = theme.bg1;
    els.csBg2.value = theme.bg2;
    els.csFg.value = theme.fg;
    els.csColors.classList.toggle('disabled', !theme.custom);

    // 角标
    els.csTags.innerHTML = '';
    for (const t of TAG_PRESETS) {
      els.csTags.appendChild(chip(t || '无', theme.tag === t, () => {
        theme.tag = t;
        saveChatThemes();
        refreshBubbleDecorAll();
        renderChatSettings();
      }));
    }
    els.csTagInput.value = theme.tag;

    // 装饰
    els.csDecos.innerHTML = '';
    for (const d of DECO_PRESETS) {
      els.csDecos.appendChild(chip(d.label, theme.deco === d.v, () => {
        theme.deco = d.v;
        saveChatThemes();
        refreshBubbleDecorAll();
        renderChatSettings();
      }));
    }
    els.csDecoInput.value = theme.deco === 'none' ? '' : theme.deco;

    // 这个对话可用的表情包分类
    const groups = state.stickers || [];
    const allowedRaw = state.stickerSets[String(state.bot.id)];
    const allowed = Array.isArray(allowedRaw) ? new Set(allowedRaw) : null;
    els.csStickerGroups.innerHTML = '';
    if (!groups.length) {
      const hint = document.createElement('span');
      hint.className = 'cs-loading';
      hint.textContent = '正在加载表情包…';
      els.csStickerGroups.appendChild(hint);
      if (!state.stickers) loadStickers();
    } else {
      for (const g of groups) {
        const key = g.key || g.name;
        const label = document.createElement('label');
        label.className = 'chip-check';
        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.dataset.key = key;
        cb.checked = allowed ? allowed.has(key) : true;
        const span = document.createElement('span');
        span.textContent = `${g.name} (${(g.items || []).length})`;
        cb.addEventListener('change', () => {
          const keys = [...els.csStickerGroups.querySelectorAll('input[type=checkbox]')]
            .filter((x) => x.checked).map((x) => x.dataset.key);
          saveStickerSet(keys);
        });
        label.append(cb, span);
        els.csStickerGroups.appendChild(label);
      }
    }

    renderChatPreview();
  }

  async function saveStickerSet(keys) {
    state.stickerSets[String(state.bot.id)] = keys;
    if (state.stickers) {
      renderStickerTabs();
      renderStickerGrid();
    }
    try {
      const res = await apiFetch('/api/sticker-sets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ peer_id: state.bot.id, groups: keys }),
      });
      if (!res.ok) toast('表情包设置保存失败');
    } catch (e) {
      toast('表情包设置保存失败：' + (e?.message || e));
    }
  }

  els.btnChatStyle.addEventListener('click', openChatSettings);
  els.settingsChatStyle.addEventListener('click', () => {
    els.settingsMask.classList.add('hidden');
    openChatSettings();
  });
  els.chatSettingsClose.addEventListener('click', closeChatSettings);
  els.chatSettingsMask.addEventListener('click', (e) => {
    if (e.target === els.chatSettingsMask) closeChatSettings();
  });
  els.csEnthusiasm.addEventListener('input', updateTraitPreview);
  els.csAffection.addEventListener('input', updateTraitPreview);
  els.csInitiativeScale.addEventListener('input', updateTraitPreview);
  els.csQuietFor.addEventListener('change', updateQuietHint);
  els.csTraitSave.addEventListener('click', saveTraits);
  els.csVoiceEnabled.addEventListener('change', updateVoiceControls);
  els.csVoiceAuto.addEventListener('change', updateVoiceControls);
  els.csVoiceSpeed.addEventListener('input', updateVoiceControls);
  els.csVoiceSave.addEventListener('click', saveVoiceSettings);
  els.csChatBgPick.addEventListener('click', () => {
    if (!state.chatBackgroundBusy) els.csChatBgInput.value = '';
  });
  els.csChatBgReset.addEventListener('click', resetChatBackground);
  els.csChatBgInput.addEventListener('change', () => {
    const file = els.csChatBgInput.files && els.csChatBgInput.files[0];
    if (file) saveChatBackground(file);
  });

  // 角色资料卡：点聊天标题里的名字打开（专属关系放这里，不挤占聊天设置）
  if (els.profileClose) {
    els.profileClose.addEventListener('click', closeProfile);
  }
  if (els.profileMask) {
    els.profileMask.addEventListener('click', (e) => {
      if (e.target === els.profileMask) closeProfile();
    });
  }
  els.profilePersonaBtn.addEventListener('click', () => openPersonaEditor(state.profileId));
  els.personaClose.addEventListener('click', closePersonaEditor);
  els.personaCancel.addEventListener('click', closePersonaEditor);
  els.personaMask.addEventListener('click', (e) => {
    if (e.target === els.personaMask) closePersonaEditor();
  });
  els.personaEditor.addEventListener('input', markPersonaDirty);
  els.personaSave.addEventListener('click', savePersonaCard);
  if (els.chatName) {
    els.chatName.style.cursor = 'pointer';
    els.chatName.title = '查看资料';
    els.chatName.addEventListener('click', () => {
      if (!isGroup() && state.bot) openProfile(state.bot.id);
    });
    els.chatName.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
      els.chatName.click();
    });
  }
  els.csSideSeg.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-side]');
    if (!b) return;
    state.chatSide = b.dataset.side === 'out' ? 'out' : 'in';
    renderChatSettings();
  });
  els.csCustom.addEventListener('change', () => {
    const theme = editTheme();
    theme.custom = els.csCustom.checked;
    saveChatThemes();
    applyChatColors();
    renderChatSettings();
  });
  for (const [el, key] of [[els.csBg1, 'bg1'], [els.csBg2, 'bg2'], [els.csFg, 'fg']]) {
    el.addEventListener('input', () => {
      const theme = editTheme();
      theme[key] = el.value;
      saveChatThemes();
      applyChatColors();
    });
  }
  els.csResetColor.addEventListener('click', () => {
    const theme = editTheme();
    const base = state.chatSide === 'out' ? DEFAULT_OUT : DEFAULT_IN;
    theme.custom = false;
    theme.bg1 = base.bg1;
    theme.bg2 = base.bg2;
    theme.fg = base.fg;
    saveChatThemes();
    applyChatColors();
    renderChatSettings();
  });
  let csInputTimer = 0;
  function scheduleDecorSave() {
    clearTimeout(csInputTimer);
    csInputTimer = setTimeout(() => {
      saveChatThemes();
      refreshBubbleDecorAll();
    }, 120);
  }
  els.csTagInput.addEventListener('input', () => {
    editTheme().tag = els.csTagInput.value.slice(0, 12);
    scheduleDecorSave();
  });
  els.csDecoInput.addEventListener('input', () => {
    editTheme().deco = els.csDecoInput.value.slice(0, 16) || 'none';
    scheduleDecorSave();
  });

  function saveToken(value) {
    state.token = String(value || '').trim();
    if (state.token) localStorage.setItem(LS_TOKEN, state.token);
    else localStorage.removeItem(LS_TOKEN);
  }

  // App 每次启动都会带来当前令牌：更新缓存后立即从地址栏移除，旧令牌不再抢先生效。
  const injectedToken = new URLSearchParams(location.search).get('access_token');
  if (injectedToken) {
    saveToken(injectedToken);
    try {
      const cleanUrl = new URL(location.href);
      cleanUrl.searchParams.delete('access_token');
      history.replaceState(null, '', cleanUrl.pathname +
        (cleanUrl.searchParams.size ? `?${cleanUrl.searchParams}` : '') + cleanUrl.hash);
    } catch (e) { /* file: 或受限 WebView 下仍可使用内存中的令牌 */ }
  }

  document.querySelectorAll('.password-toggle[data-target]').forEach((button) => {
    button.addEventListener('click', () => {
      const input = document.getElementById(button.dataset.target);
      if (!input) return;
      const reveal = input.type === 'password';
      input.type = reveal ? 'text' : 'password';
      button.textContent = reveal ? '隐藏' : '显示';
      button.setAttribute('aria-pressed', String(reveal));
      button.setAttribute('aria-label', `${reveal ? '隐藏' : '显示'}密码或令牌`);
    });
  });

  if (window.starlitAndroid && typeof window.starlitAndroid.openSync === 'function') {
    $('#settingsLanSyncRow').classList.remove('hidden');
    $('#settingsLanSync').addEventListener('click', () => {
      els.settingsMask.classList.add('hidden');
      window.starlitAndroid.openSync();
    });
  }

  els.settingsTokenSave.addEventListener('click', () => {
    saveToken(els.settingsToken.value);
    els.settingsMask.classList.add('hidden');
    toast('令牌已保存，正在重新连接并检查初始化状态');
    loadServiceSettings();
    reconnectNow();
  });

  els.tokenSave.addEventListener('click', () => {
    saveToken(els.tokenInput.value);
    els.tokenRow.classList.add('hidden');
    connect();
  });
  els.tokenInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') els.tokenSave.click();
  });

  els.connectBtn.addEventListener('click', () => {
    if (state.ws) { reconnectNow(); return; }
    connect();
  });

  // ---------------------------------------------------------- 完整历史搜索
  let searchTimer = 0;

  function setChatSearchVisible(visible) {
    els.chatSearch.classList.toggle('hidden', !visible);
    els.btnSearchMsg.setAttribute('aria-expanded', String(visible));
  }

  function resetSearchState(query = '', key = curConvKey()) {
    const s = state.historySearch;
    s.requestSeq += 1;
    s.locateSeq += 1;
    if (s.controller) s.controller.abort();
    s.controller = null;
    s.key = String(key);
    s.query = String(query || '');
    s.items = [];
    s.seen = new Set();
    s.searched = false;
    s.hasMore = false;
    s.nextBeforeId = '';
    s.loading = false;
    s.loadingMore = false;
    s.error = '';
    s.locatingMid = '';
    s.locateError = '';
  }

  function clearSearch() {
    clearTimeout(searchTimer);
    resetSearchState();
    renderHistorySearch();
  }

  function toggleChatSearch(show) {
    const visible = show !== undefined ? show : els.chatSearch.classList.contains('hidden');
    if (visible && state.historySearch.key &&
        state.historySearch.key !== curConvKey()) {
      els.chatSearchInput.value = '';
      clearSearch();
    }
    setChatSearchVisible(visible);
    if (visible) {
      setTimeout(() => els.chatSearchInput.focus(), 30);
    } else {
      clearTimeout(searchTimer);
      els.chatSearchInput.value = '';
      clearSearch();
    }
  }

  function searchResultOf(raw, key) {
    const mid = String(raw?.message_id || '');
    const segs = segsOf(raw);
    const text = (segsToText(segs) || String(raw?.raw_message || '') || '[消息]')
      .replace(/\s+/g, ' ').trim() || '[消息]';
    const senderId = String(raw?.sender?.user_id ?? raw?.user_id ?? '');
    let name = state.me.name;
    if (key.charAt(0) === 'g') {
      const sender = senderOf(raw);
      name = isOwner(senderId) ? state.me.name : sender.name;
    } else if (Number(senderId) === Number(key)) {
      const char = state.characters.find((c) => String(c.id) === key);
      name = char?.name || (String(state.bot.id) === key ? state.bot.name : '对方');
    }
    return { mid, raw, text, name, ts: Number(raw?.time) || 0 };
  }

  function escapeRegExp(text) {
    return String(text).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function appendHighlighted(parent, text, query) {
    const q = String(query || '').trim();
    if (!q) {
      parent.textContent = text;
      return;
    }
    const re = new RegExp(escapeRegExp(q), 'gi');
    let last = 0;
    let match;
    while ((match = re.exec(text))) {
      if (!match[0]) {
        re.lastIndex += 1;
        continue;
      }
      if (match.index > last) {
        parent.appendChild(document.createTextNode(text.slice(last, match.index)));
      }
      const mark = document.createElement('mark');
      mark.className = 'search-hit';
      mark.textContent = match[0];
      parent.appendChild(mark);
      last = match.index + match[0].length;
    }
    if (last < text.length) {
      parent.appendChild(document.createTextNode(text.slice(last)));
    }
  }

  function renderHistorySearch() {
    const s = state.historySearch;
    els.searchCount.textContent = s.searched && s.items.length
      ? `${s.items.length} 条` : '';
    const showBody = !!s.query && (s.searched || s.loading || s.loadingMore ||
      !!s.error || !!s.locatingMid || !!s.locateError);
    els.chatSearchBody.classList.toggle('hidden', !showBody);

    let status = '';
    let statusError = false;
    if (s.locatingMid) status = '正在定位消息，可能需要加载更早的历史…';
    else if (s.locateError) { status = s.locateError; statusError = true; }
    else if (s.loading) status = '正在搜索完整历史…';
    else if (s.loadingMore) status = '正在加载更多搜索结果…';
    else if (s.searched && !s.error && !s.items.length && s.query) {
      status = `完整历史中没有找到“${s.query}”`;
    }
    els.chatSearchStatus.textContent = status;
    els.chatSearchStatus.classList.toggle('hidden', !status);
    els.chatSearchStatus.classList.toggle('error', statusError);
    els.chatSearchError.classList.toggle('hidden', !s.error);
    els.chatSearchErrorText.textContent = s.error ? `搜索失败：${s.error}` : '';

    els.chatSearchResults.innerHTML = '';
    for (const item of s.items) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'chat-search-result' +
        (s.locatingMid === item.mid ? ' is-locating' : '');
      btn.dataset.mid = item.mid;
      btn.setAttribute('aria-label',
        `${item.name}，${item.ts ? fmtSep(item.ts) : '时间未知'}，${item.text}，点击定位消息`);
      const head = document.createElement('span');
      head.className = 'chat-search-result-head';
      const name = document.createElement('strong');
      name.textContent = item.name;
      const time = document.createElement('time');
      time.textContent = item.ts ? fmtSep(item.ts) : '';
      head.append(name, time);
      const text = document.createElement('span');
      text.className = 'chat-search-result-text';
      appendHighlighted(text, item.text, s.query);
      btn.append(head, text);
      if (s.locatingMid === item.mid) {
        const locating = document.createElement('span');
        locating.className = 'chat-search-result-locating';
        locating.textContent = '定位中…';
        btn.appendChild(locating);
      }
      els.chatSearchResults.appendChild(btn);
    }
    els.searchMore.classList.toggle('hidden',
      !s.hasMore || !s.items.length || s.loading);
    els.searchMore.disabled = s.loadingMore;
    els.searchMore.textContent = s.loadingMore ? '正在加载更多…' : '加载更多';
  }

  async function runSearch(loadMore = false) {
    clearTimeout(searchTimer);
    const s = state.historySearch;
    const key = curConvKey();
    const query = els.chatSearchInput.value.trim();
    if (loadMore) {
      if (s.loading || s.loadingMore || !s.searched || !s.hasMore ||
          s.key !== key || s.query !== query) return;
      if (!s.nextBeforeId) {
        s.error = '缺少下一页游标，请重新搜索';
        renderHistorySearch();
        return;
      }
    } else {
      resetSearchState(query, key);
      if (!query) { renderHistorySearch(); return; }
      s.searched = true;
    }

    const seq = s.requestSeq;
    const beforeId = loadMore ? s.nextBeforeId : '';
    const controller = new AbortController();
    s.controller = controller;
    s.error = '';
    s.locateError = '';
    s.loading = !loadMore;
    s.loadingMore = loadMore;
    renderHistorySearch();
    const isCurrent = () => seq === s.requestSeq && s.key === key &&
      s.query === query && curConvKey() === key &&
      els.chatSearchInput.value.trim() === query;

    try {
      const params = new URLSearchParams({
        query, limit: String(SEARCH_PAGE),
      });
      if (key.charAt(0) === 'g') params.set('group_id', key.slice(1));
      else params.set('peer_id', key);
      if (beforeId) params.set('before_id', beforeId);
      const res = await apiFetch('/api/history/search?' + params.toString(), {
        cache: 'no-store', signal: controller.signal,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data || data.ok !== true) {
        throw new Error(String(data?.error || `请求失败（${res.status}）`));
      }
      if (!isCurrent()) return;
      for (const raw of (Array.isArray(data.messages) ? data.messages : [])) {
        const item = searchResultOf(raw, key);
        if (!item.mid || s.seen.has(item.mid)) continue;
        s.seen.add(item.mid);
        s.items.push(item);
      }
      s.hasMore = !!data.has_more;
      s.nextBeforeId = String(data.next_before_id ?? '');
      if (loadMore && s.hasMore && s.nextBeforeId === beforeId) {
        s.error = '搜索分页未能继续，请重试';
      }
    } catch (e) {
      if (e?.name === 'AbortError' || !isCurrent()) return;
      s.error = e?.message || '网络请求失败';
    } finally {
      if (seq === s.requestSeq) {
        s.loading = false;
        s.loadingMore = false;
        if (s.controller === controller) s.controller = null;
        renderHistorySearch();
      }
    }
  }

  async function findSearchTarget(key, mid, isCurrent) {
    while (isCurrent()) {
      let target = findMessageByMid(state.msgs, mid);
      if (target) return { target };
      if (state.historyLoading[key]) {
        await new Promise((resolve) => setTimeout(resolve, 120));
        continue;
      }
      if (state.hasMore[key] === false) return { notFound: true };
      const snapshot = JSON.stringify([
        state.winStart[key] || 0, state.historyCursor[key] || '',
        state.hasMore[key], state.msgs.length,
        state.msgs[0]?.mid || '', state.msgs[state.msgs.length - 1]?.mid || '',
      ]);
      // 返回值只是新增条数；重复页新增为 0 时仍要依据游标继续翻。
      await loadEarlier();
      if (!isCurrent()) return {};
      target = findMessageByMid(state.msgs, mid);
      if (target) return { target };
      if (state.historyError[key]) return { error: state.historyError[key] };
      if (state.hasMore[key] === false) return { notFound: true };
      const next = JSON.stringify([
        state.winStart[key] || 0, state.historyCursor[key] || '',
        state.hasMore[key], state.msgs.length,
        state.msgs[0]?.mid || '', state.msgs[state.msgs.length - 1]?.mid || '',
      ]);
      if (snapshot === next) return { error: '历史消息分页未能继续' };
    }
    return {};
  }

  async function locateSearchResult(mid) {
    const s = state.historySearch;
    const key = curConvKey();
    if (!mid || s.key !== key || !s.items.some((item) => item.mid === mid)) return;
    if (s.locatingMid) { toast('正在定位消息，请稍候'); return; }
    const seq = ++s.locateSeq;
    s.locatingMid = mid;
    s.locateError = '';
    renderHistorySearch();
    const isCurrent = () => seq === s.locateSeq && curConvKey() === key &&
      s.key === key;
    try {
      const result = await findSearchTarget(key, mid, isCurrent);
      if (!isCurrent()) return;
      if (result.target) {
        // 等 loadEarlier 的滚动位置补偿完成，再滚动到目标真实消息行。
        requestAnimationFrame(() => requestAnimationFrame(() => {
          if (!isCurrent()) return;
          const row = revealLoadedMessage(result.target, key);
          s.locatingMid = '';
          if (!row) s.locateError = '消息已找到，但未能显示在当前消息列表中';
          else if (window.matchMedia('(max-width: 880px)').matches) {
            setChatSearchVisible(false); // 保留结果，点搜索可继续查看
          }
          renderHistorySearch();
        }));
        return;
      }
      s.locatingMid = '';
      s.locateError = result.notFound
        ? '没有找到这条消息，可能已被删除或历史记录不可用'
        : '历史消息加载失败，点击这条结果可重试';
      renderHistorySearch();
    } catch (e) {
      if (!isCurrent()) return;
      s.locatingMid = '';
      s.locateError = '历史消息加载失败，点击这条结果可重试';
      renderHistorySearch();
    }
  }

  els.btnSearchMsg.addEventListener('click', () => toggleChatSearch());
  els.searchClose.addEventListener('click', () => toggleChatSearch(false));
  els.searchRetry.addEventListener('click', () => {
    const s = state.historySearch;
    runSearch(!!(s.items.length && s.nextBeforeId));
  });
  els.searchMore.addEventListener('click', () => runSearch(true));
  els.chatSearchResults.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-mid]');
    if (btn) locateSearchResult(btn.dataset.mid);
  });
  els.chatSearchResults.addEventListener('keydown', (e) => {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) return;
    const items = [...els.chatSearchResults.querySelectorAll('button[data-mid]')];
    if (!items.length) return;
    const index = items.indexOf(document.activeElement);
    if (e.key === 'ArrowUp' && index <= 0) {
      e.preventDefault();
      els.chatSearchInput.focus();
      return;
    }
    let next = index;
    if (e.key === 'ArrowDown') next = Math.min(items.length - 1, index + 1);
    else if (e.key === 'ArrowUp') next = Math.max(0, index - 1);
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = items.length - 1;
    if (next >= 0) {
      e.preventDefault();
      items[next].focus();
    }
  });
  els.chatSearchInput.addEventListener('input', () => {
    clearTimeout(searchTimer);
    const query = els.chatSearchInput.value.trim();
    resetSearchState(query);
    renderHistorySearch();
    if (query) searchTimer = setTimeout(() => runSearch(), 280);
  });
  els.chatSearchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      runSearch();
    } else if (e.key === 'ArrowDown') {
      const first = els.chatSearchResults.querySelector('button[data-mid]');
      if (first) { e.preventDefault(); first.focus(); }
    }
  });

  // ---------------------------------------------------------- 左侧全局搜索
  let globalSearchTimer = 0;

  function globalConversationName(key) {
    if (key.charAt(0) === 'g') {
      return state.groups.find((g) => String(g.group_id) === key.slice(1))?.group_name || '群聊';
    }
    return state.characters.find((c) => String(c.id) === key)?.name || '角色';
  }

  function clearGlobalSearch(clearInput = false) {
    clearTimeout(globalSearchTimer);
    const s = state.globalSearch;
    s.requestSeq += 1;
    if (s.controller) s.controller.abort();
    Object.assign(s, { query: '', items: [], loading: false, searched: false,
                       error: '', controller: null });
    if (clearInput) els.searchInput.value = '';
    renderGlobalSearch();
  }

  function globalSearchButton(item, query, message = false) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'global-search-item' + (message ? ' message' : '');
    btn.dataset.key = item.key;
    if (message) btn.dataset.mid = item.mid;
    const av = document.createElement('div');
    av.className = 'avatar ' + (item.key.charAt(0) === 'g' ? 'group-avatar' : 'bot-avatar');
    const name = globalConversationName(item.key);
    if (item.key.charAt(0) === 'g') fillGroupAvatar(av, name, item.key.slice(1));
    else fillAvatar(av, name, item.key);
    const main = document.createElement('span');
    main.className = 'global-search-item-main';
    const top = document.createElement('span');
    top.className = 'global-search-item-top';
    const strong = document.createElement('strong');
    if (message) {
      const source = document.createElement('span');
      source.className = 'global-search-source';
      source.textContent = name + ' · ';
      strong.appendChild(source);
      appendHighlighted(strong, item.name, query);
    } else {
      appendHighlighted(strong, name, query);
    }
    top.appendChild(strong);
    if (message && item.ts) {
      const time = document.createElement('time');
      time.textContent = fmtConvTime(item.ts);
      top.appendChild(time);
    }
    const text = document.createElement('span');
    text.className = 'global-search-item-text';
    appendHighlighted(text, message ? item.text :
      (item.key.charAt(0) === 'g' ? '群聊' : '角色'), query);
    main.append(top, text);
    btn.append(av, main);
    btn.setAttribute('aria-label', message
      ? `${name}，${item.name}：${item.text}，点击定位消息`
      : `打开${name}`);
    return btn;
  }

  function renderGlobalSearch() {
    const s = state.globalSearch;
    const active = !!s.query;
    els.globalSearchPanel.classList.toggle('hidden', !active);
    els.listPane.classList.toggle('global-searching', active);
    els.searchInput.setAttribute('aria-expanded', String(active));
    if (!active) {
      els.globalSearchResults.innerHTML = '';
      els.globalSearchStatus.textContent = '';
      return;
    }
    const q = s.query.toLocaleLowerCase();
    const contacts = state.characters.filter((c) =>
      String(c.name).toLocaleLowerCase().includes(q)).map((c) => ({ key: String(c.id) }));
    const groups = state.groups.filter((g) =>
      String(g.group_name || '').toLocaleLowerCase().includes(q)).map((g) =>
      ({ key: groupKey(g.group_id) }));
    els.globalSearchResults.innerHTML = '';
    const addSection = (title, items, message = false) => {
      if (!items.length) return;
      const section = document.createElement('section');
      section.className = 'global-search-section';
      const heading = document.createElement('div');
      heading.className = 'global-search-heading';
      heading.textContent = title;
      section.appendChild(heading);
      for (const item of items) {
        section.appendChild(globalSearchButton(item, s.query, message));
      }
      els.globalSearchResults.appendChild(section);
    };
    addSection('角色', contacts);
    addSection('群聊', groups);
    addSection(s.items.length ? `消息 · 显示 ${s.items.length} 条` : '消息', s.items, true);
    els.globalSearchStatus.classList.toggle('error', !!s.error);
    els.globalSearchStatus.textContent = s.error ||
      (s.loading ? '正在搜索各会话的完整消息历史…' :
       (!contacts.length && !groups.length && s.searched && !s.items.length
         ? `没有找到“${s.query}”相关内容` : ''));
  }

  async function runGlobalSearch() {
    clearTimeout(globalSearchTimer);
    const query = els.searchInput.value.trim();
    const s = state.globalSearch;
    if (!query) { clearGlobalSearch(); renderConvList(); return; }
    s.requestSeq += 1;
    if (s.controller) s.controller.abort();
    Object.assign(s, { query, items: [], loading: true, searched: true, error: '' });
    const seq = s.requestSeq;
    const controller = new AbortController();
    s.controller = controller;
    renderGlobalSearch();
    const keys = state.characters.map((c) => String(c.id)).concat(
      state.groups.map((g) => groupKey(g.group_id)));
    const jobs = keys.map(async (key) => {
      const params = new URLSearchParams({ query, limit: '6' });
      if (key.charAt(0) === 'g') params.set('group_id', key.slice(1));
      else params.set('peer_id', key);
      const res = await apiFetch('/api/history/search?' + params.toString(), {
        cache: 'no-store', signal: controller.signal,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.ok !== true) throw new Error(data.error || '搜索失败');
      return (Array.isArray(data.messages) ? data.messages : []).map((raw) =>
        ({ ...searchResultOf(raw, key), key }));
    });
    try {
      const pages = await Promise.allSettled(jobs);
      if (seq !== s.requestSeq || els.searchInput.value.trim() !== query) return;
      const failed = pages.filter((p) => p.status === 'rejected').length;
      const seen = new Set();
      s.items = pages.flatMap((p) => p.status === 'fulfilled' ? p.value : [])
        .filter((item) => {
          const id = item.key + '\n' + item.mid;
          if (!item.mid || seen.has(id)) return false;
          seen.add(id);
          return true;
        }).sort((a, b) => b.ts - a.ts).slice(0, 30);
      if (failed === keys.length && keys.length) s.error = '消息搜索失败，请检查连接后重试';
      else if (failed) s.error = `已显示可用结果，${failed} 个会话暂时搜索失败`;
    } catch (e) {
      if (e?.name !== 'AbortError' && seq === s.requestSeq) s.error = '消息搜索失败，请稍后重试';
    } finally {
      if (seq === s.requestSeq) {
        s.loading = false;
        if (s.controller === controller) s.controller = null;
        renderGlobalSearch();
      }
    }
  }

  async function openGlobalMessage(key, mid) {
    clearTimeout(globalSearchTimer);
    clearGlobalSearch(true);
    selectPeer(key.charAt(0) === 'g' ? 'group' : 'private',
      key.charAt(0) === 'g' ? key.slice(1) : key);
    if (curConvKey() !== key) return;
    if (window.matchMedia('(max-width: 880px)').matches) openMobileChat();
    const s = state.globalSearch;
    const seq = ++s.locateSeq;
    const isCurrent = () => seq === s.locateSeq && curConvKey() === key;
    toast('正在定位消息…');
    try {
      while (state.historyLoading[key] && isCurrent()) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      if (!isCurrent()) return;
      if (!state.loaded[key]) await loadHistoryFor(key);
      const result = await findSearchTarget(key, mid, isCurrent);
      if (!isCurrent()) return;
      if (!result.target) {
        toast(result.error || '没有找到这条消息，可能已被删除');
        return;
      }
      requestAnimationFrame(() => requestAnimationFrame(() => {
        if (isCurrent() && !revealLoadedMessage(result.target, key)) {
          toast('消息已找到，但未能显示');
        }
      }));
    } catch (e) {
      if (isCurrent()) toast('历史消息加载失败，请重试');
    }
  }

  els.globalSearchResults.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-key]');
    if (!btn) return;
    const key = btn.dataset.key;
    if (btn.dataset.mid) openGlobalMessage(key, btn.dataset.mid);
    else {
      clearGlobalSearch(true);
      selectPeer(key.charAt(0) === 'g' ? 'group' : 'private',
        key.charAt(0) === 'g' ? key.slice(1) : key);
      if (window.matchMedia('(max-width: 880px)').matches) openMobileChat();
    }
  });
  els.searchInput.addEventListener('input', () => {
    clearTimeout(globalSearchTimer);
    const s = state.globalSearch;
    s.requestSeq += 1;
    if (s.controller) s.controller.abort();
    Object.assign(s, { query: els.searchInput.value.trim(), items: [],
                       loading: false, searched: false, error: '', controller: null });
    renderGlobalSearch();
    renderConvList();
    if (s.query) globalSearchTimer = setTimeout(runGlobalSearch, 320);
  });
  els.searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      runGlobalSearch();
    } else if (e.key === 'Escape' && els.searchInput.value) {
      e.preventDefault();
      clearGlobalSearch(true);
      renderConvList();
    } else if (e.key === 'ArrowDown') {
      const first = els.globalSearchResults.querySelector('button[data-key]');
      if (first) { e.preventDefault(); first.focus(); }
    }
  });

  // ---------------------------------------------------------- 移动端
  const MOBILE_CHAT_STATE = 'starlitMobileChat';
  function isMobileChatEntry(value = history.state) {
    return !!(value && value[MOBILE_CHAT_STATE]);
  }

  function openMobileChat(fromHistory = false) {
    const mobile = window.matchMedia('(max-width: 880px)').matches;
    if (mobile && !fromHistory && !isMobileChatEntry() &&
        !els.appView.classList.contains('mobile-chat')) {
      const current = history.state && typeof history.state === 'object' ? history.state : {};
      try {
        history.pushState({ ...current, [MOBILE_CHAT_STATE]: true }, '');
      } catch (e) { /* 容器不支持历史状态时保留显式返回 */ }
    }
    els.appView.classList.add('mobile-chat');
    els.contactsPage.classList.add('hidden');
    closeMobileActions(false);
    setMobileTab('messages');
    scrollToBottom(false);
  }

  function closeMobileChat() {
    saveCurrentDraft();
    els.appView.classList.remove('mobile-chat');
    stopVoicePlayback();
    resetVoiceRecorder();
    hidePanels();
    closeMobileActions(false);
    setMobileTab('messages');
    els.chatPane.classList.remove('swiping');
    els.chatPane.style.transform = '';
    els.chatPane.style.opacity = '';
  }

  function requestMobileChatClose() {
    if (isMobileChatEntry() && window.matchMedia('(max-width: 880px)').matches) {
      history.back();
      return;
    }
    closeMobileChat();
  }

  window.addEventListener('popstate', (event) => {
    if (isMobileChatEntry(event.state) && window.matchMedia('(max-width: 880px)').matches) {
      openMobileChat(true);
    } else if (els.appView.classList.contains('mobile-chat')) {
      closeMobileChat();
    }
  });

  // 移动端边缘右滑返回：从屏幕左侧 28px 内起手，滑过 72px 关闭聊天。
  const EDGE_SWIPE_START_PX = 28;
  const EDGE_SWIPE_CLOSE_PX = 72;
  let edgeSwipe = null;

  function edgeSwipeBlocked() {
    return !window.matchMedia('(max-width: 880px)').matches ||
      !els.appView.classList.contains('mobile-chat') ||
      !els.lightbox.classList.contains('hidden') ||
      !els.mobileActions.classList.contains('hidden') ||
      !els.mobileGlobalActions.classList.contains('hidden');
  }

  els.chatPane.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse' || edgeSwipeBlocked()) return;
    if (e.clientX > EDGE_SWIPE_START_PX) return;
    edgeSwipe = {
      id: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      dx: 0,
      dy: 0,
      dragging: false,
    };
  });

  els.chatPane.addEventListener('pointermove', (e) => {
    if (!edgeSwipe || e.pointerId !== edgeSwipe.id) return;
    const dx = Math.max(0, e.clientX - edgeSwipe.startX);
    const dy = e.clientY - edgeSwipe.startY;
    edgeSwipe.dx = dx;
    edgeSwipe.dy = dy;
    if (!edgeSwipe.dragging) {
      if (dx < 10 || dx < Math.abs(dy) * 1.2) return;
      edgeSwipe.dragging = true;
      els.chatPane.classList.add('swiping');
    }
    const width = Math.max(1, els.chatPane.getBoundingClientRect().width);
    const offset = Math.min(width, dx);
    els.chatPane.style.transform = `translateX(${offset}px)`;
    els.chatPane.style.opacity = String(Math.max(0.6, 1 - offset / width * 0.35));
  });

  function finishEdgeSwipe(canceled) {
    const swipe = edgeSwipe;
    if (!swipe) return;
    edgeSwipe = null;
    els.chatPane.classList.remove('swiping');
    if (swipe.dragging && !canceled &&
        swipe.dx >= EDGE_SWIPE_CLOSE_PX &&
        swipe.dx > Math.abs(swipe.dy) * 1.2) {
      els.chatPane.style.transform = 'translateX(100%)';
      els.chatPane.style.opacity = '1';
      setTimeout(() => requestMobileChatClose(), 200);
      return;
    }
    els.chatPane.style.transform = '';
    els.chatPane.style.opacity = '';
  }

  els.chatPane.addEventListener('pointerup', (e) => {
    if (!edgeSwipe || e.pointerId !== edgeSwipe.id) return;
    finishEdgeSwipe(false);
  });

  els.chatPane.addEventListener('pointercancel', (e) => {
    if (!edgeSwipe || e.pointerId !== edgeSwipe.id) return;
    finishEdgeSwipe(true);
  });

  function setMobileTab(tab) {
    state.mobileTab = tab || 'messages';
    els.mobileNav.querySelectorAll('.mn-item').forEach((b) => {
      b.classList.toggle('active', b.dataset.tab === state.mobileTab);
    });
  }

  function switchMobileTab(tab) {
    if (tab === 'contacts') {
      els.contactsPage.classList.remove('hidden');
      setMobileTab('contacts');
      return;
    }
    els.contactsPage.classList.add('hidden');
    if (tab === 'stickers') {
      openMobileChat();
      showPanel('stickerPanel');
      setMobileTab('stickers');
      return;
    }
    if (tab === 'me') {
      setMobileTab('me');
      openSettings();
      return;
    }
    requestMobileChatClose();
  }

  els.backBtn.addEventListener('click', requestMobileChatClose);
  els.mobileNav.addEventListener('click', (e) => {
    const b = e.target.closest('.mn-item');
    if (b) switchMobileTab(b.dataset.tab);
  });
  els.contactsBack.addEventListener('click', () => {
    els.contactsPage.classList.add('hidden');
    setMobileTab('messages');
  });
  els.contactsAdd.addEventListener('click', openMobileGlobalActions);

  let mobileActionsReturnFocus = null;
  let mobileGlobalReturnFocus = null;
  let mobileComposerReturnFocus = null;
  function closeMobileComposerActions(restoreFocus = true) {
    if (els.mobileComposerActions.classList.contains('hidden')) return;
    els.mobileComposerActions.classList.add('hidden');
    const target = mobileComposerReturnFocus;
    mobileComposerReturnFocus = null;
    if (restoreFocus && target && target.isConnected) {
      target.focus({ preventScroll: true });
    }
  }

  function closeMobileGlobalActions(restoreFocus = true) {
    closeMobileComposerActions(false);
    if (els.mobileGlobalActions.classList.contains('hidden')) return;
    els.mobileGlobalActions.classList.add('hidden');
    const target = mobileGlobalReturnFocus;
    mobileGlobalReturnFocus = null;
    if (restoreFocus && target && target.isConnected) {
      target.focus({ preventScroll: true });
    }
  }

  function closeMobileActions(restoreFocus = true) {
    closeMobileGlobalActions(false);
    if (els.mobileActions.classList.contains('hidden')) return;
    els.mobileActions.classList.add('hidden');
    const target = mobileActionsReturnFocus;
    mobileActionsReturnFocus = null;
    if (restoreFocus && target && target.isConnected) {
      target.focus({ preventScroll: true });
    }
  }

  function focusFirstSheetAction(container, selector) {
    requestAnimationFrame(() => {
      if (container.classList.contains('hidden')) return;
      const first = [...container.querySelectorAll(selector)]
        .find((button) => button.getClientRects().length);
      (first || container.querySelector('.cancel')).focus({ preventScroll: true });
    });
  }

  function openMobileActions() {
    closeConversationMenu(false);
    closeConversationActions(false);
    closeMobileGlobalActions(false);
    mobileActionsReturnFocus = document.activeElement;
    els.mobileActions.classList.remove('hidden');
    focusFirstSheetAction(els.mobileActions, 'button[data-act]');
  }

  function openMobileGlobalActions() {
    closeConversationMenu(false);
    closeConversationActions(false);
    closeMobileActions(false);
    mobileGlobalReturnFocus = document.activeElement;
    els.mobileGlobalActions.classList.remove('hidden');
    focusFirstSheetAction(els.mobileGlobalActions, 'button[data-global-act]');
  }

  function openMobileComposerActions() {
    closeConversationMenu(false);
    closeConversationActions(false);
    closeMobileActions(false);
    mobileComposerReturnFocus = document.activeElement;
    els.mobileComposerActions.classList.remove('hidden');
    focusFirstSheetAction(els.mobileComposerActions, 'button[data-composer-act]');
  }

  els.mobilePlus.addEventListener('click', openMobileGlobalActions);
  els.mobileMoreBtn.addEventListener('click', openMobileComposerActions);
  els.mobileComposerActions.addEventListener('click', (e) => {
    if (e.target === els.mobileComposerActions) {
      closeMobileComposerActions();
      return;
    }
    const b = e.target.closest('button[data-composer-act]');
    if (!b) return;
    const act = b.dataset.composerAct;
    closeMobileComposerActions(act === 'close');
    if (act === 'image') els.imageBtn.click();
    else if (act === 'sticker') showPanel('stickerPanel');
    else if (act === 'voice') els.voiceBtn.click();
  });
  els.mobileActions.addEventListener('click', (e) => {
    if (e.target === els.mobileActions) {
      closeMobileActions();
      return;
    }
    const b = e.target.closest('button[data-act]');
    if (!b) return;
    const act = b.dataset.act;
    closeMobileActions(act === 'close');
    if (act === 'close') return;
    if (['profile', 'memories', 'sharedLife'].includes(act)) {
      openCurrentCharacterView(act);
    } else if (act === 'searchMessages') {
      openMobileChat();
      toggleChatSearch(true);
    } else if (act === 'chatStyle') {
      if (isGroup()) openGroupSet();          // 群里没有按对话的气泡设置
      else openChatSettings();
    } else if (act === 'multiselect') {
      openMobileChat();
      enterSelectMode();
    } else if (act === 'stickerManage') {
      openMobileChat();
      showPanel('stickerPanel');
      setStickerManage(true);
    }
  });

  els.mobileGlobalActions.addEventListener('click', (e) => {
    if (e.target === els.mobileGlobalActions) {
      closeMobileGlobalActions();
      return;
    }
    const b = e.target.closest('button[data-global-act]');
    if (!b) return;
    const act = b.dataset.globalAct;
    closeMobileGlobalActions(act === 'close');
    if (act === 'addCharacter') openCharacterModal();
    else if (act === 'createGroup') openCreateGroup();
    else if (act === 'theme') {
      setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
    } else if (act === 'settings') openSettings();
  });

  // ---------------------------------------------------------- 图片大图
  let lightboxReturnFocus = null;
  function openLightbox(src) {
    if (!src) return;
    if (els.lightbox.classList.contains('hidden')) {
      lightboxReturnFocus = document.activeElement;
    }
    els.lightboxImg.src = src;
    els.lightbox.classList.remove('hidden');
    requestAnimationFrame(() => {
      if (els.lightbox.classList.contains('hidden')) return;
      els.lightbox.querySelector('.lightbox-close').focus({ preventScroll: true });
    });
  }
  function closeLightbox() {
    if (els.lightbox.classList.contains('hidden')) return;
    els.lightbox.classList.add('hidden');
    els.lightboxImg.removeAttribute('src');
    const target = lightboxReturnFocus;
    lightboxReturnFocus = null;
    if (target && target.isConnected) target.focus({ preventScroll: true });
  }
  els.lightbox.addEventListener('click', closeLightbox);

  // ---------------------------------------------------------- 全局点击 / 快捷键
  document.addEventListener('pointerdown', (e) => {
    if (!els.ctxMenu.classList.contains('hidden') && !els.ctxMenu.contains(e.target)) {
      els.ctxMenu.classList.add('hidden');
    }
    if (!els.convMenu.classList.contains('hidden') && !els.convMenu.contains(e.target) &&
        !(e.target.closest && e.target.closest('.conv-more'))) {
      closeConversationMenu(false);
    }
    if (els.memberMenu && !els.memberMenu.classList.contains('hidden') &&
        !els.memberMenu.contains(e.target)) {
      els.memberMenu.classList.add('hidden');
    }
    if (!els.moreMenu.classList.contains('hidden') && !els.moreMenu.contains(e.target) &&
        !els.btnMore.contains(e.target)) {
      els.moreMenu.classList.add('hidden');
    }
    if (!els.presenceMenu.classList.contains('hidden') &&
        !els.presenceMenu.contains(e.target) &&
        !(els.presenceChip && els.presenceChip.contains(e.target)) &&
        !(els.mobilePresence && els.mobilePresence.contains(e.target))) {
      els.presenceMenu.classList.add('hidden');
    }
    if (!els.emojiPanel.classList.contains('hidden') &&
        !els.emojiPanel.contains(e.target) && !els.emojiBtn.contains(e.target)) {
      els.emojiPanel.classList.add('hidden');
      els.emojiBtn.classList.remove('active');
    }
    if (!els.stickerPanel.classList.contains('hidden') &&
        !els.stickerPanel.contains(e.target) && !els.stickerBtn.contains(e.target) &&
        !els.railSticker.contains(e.target)) {
      els.stickerPanel.classList.add('hidden');
      els.stickerBtn.classList.remove('active');
    }
  });

  function setupDialogA11y() {
    const masks = [...document.querySelectorAll('.modal-mask')];
    const focusableSelector = [
      'a[href]', 'button:not([disabled])', 'input:not([disabled])',
      'textarea:not([disabled])', 'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(',');
    const visibleDialog = () => masks
      .filter((mask) => !mask.classList.contains('hidden'))
      .map((mask) => mask.querySelector('.modal'))
      .filter(Boolean).pop() || null;
    const visibleTransientDialog = () => {
      if (!els.lightbox.classList.contains('hidden')) return els.lightbox;
      if (!els.mobileActions.classList.contains('hidden')) {
        return els.mobileActions.querySelector('.sheet') || els.mobileActions;
      }
      if (!els.mobileGlobalActions.classList.contains('hidden')) {
        return els.mobileGlobalActions.querySelector('.sheet') || els.mobileGlobalActions;
      }
      return null;
    };
    const focusableItems = (dialog) => [...dialog.querySelectorAll(focusableSelector)]
      .filter((node) => node.getClientRects().length && node.getAttribute('aria-hidden') !== 'true');
    let returnFocus = null;

    masks.forEach((mask, index) => {
      const dialog = mask.querySelector('.modal');
      if (!dialog) return;
      const title = dialog.querySelector('h2');
      if (title && !title.id) title.id = `dialog-title-${index + 1}`;
      dialog.setAttribute('role', 'dialog');
      dialog.setAttribute('aria-modal', 'true');
      dialog.tabIndex = -1;
      if (title) dialog.setAttribute('aria-labelledby', title.id);
      else dialog.setAttribute('aria-label', '对话框');

      new MutationObserver(() => {
        if (!mask.classList.contains('hidden')) {
          const active = document.activeElement;
          if (active && active !== document.body && !active.closest('.modal')) {
            returnFocus = active;
          }
          requestAnimationFrame(() => {
            if (mask.classList.contains('hidden') || dialog.contains(document.activeElement)) return;
            const preferred = dialog.querySelector(
              '.modal-body [autofocus], .modal-body input:not([disabled]), ' +
              '.modal-body textarea:not([disabled]), .modal-body button:not([disabled])'
            );
            (preferred || focusableItems(dialog)[0] || dialog).focus({ preventScroll: true });
          });
        } else if (!visibleDialog() && returnFocus) {
          const target = returnFocus;
          requestAnimationFrame(() => {
            if (!visibleDialog() && target.isConnected) target.focus({ preventScroll: true });
          });
        }
      }).observe(mask, { attributes: true, attributeFilter: ['class'] });
    });

    document.addEventListener('focusin', (e) => {
      if (e.target !== document.body && !visibleDialog() && !visibleTransientDialog() &&
          !e.target.closest('.modal-mask, .action-sheet, .lightbox')) {
        returnFocus = e.target;
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const dialog = visibleTransientDialog() || visibleDialog();
      if (!dialog) return;
      const items = focusableItems(dialog);
      if (!items.length) { e.preventDefault(); dialog.focus(); return; }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !dialog.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !dialog.contains(active))) {
        e.preventDefault();
        first.focus();
      }
    });

    document.querySelectorAll('.modal-head .icon-btn, .panel-close, #searchClose')
      .forEach((button) => {
        if (!button.hasAttribute('aria-label')) button.setAttribute('aria-label', '关闭');
      });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (!els.lightbox.classList.contains('hidden')) { closeLightbox(); return; }
      if (!els.avatarMask.classList.contains('hidden')) { closeAvatarCrop(); return; }
      if (!els.sharedLifeMask.classList.contains('hidden')) { closeSharedLife(); return; }
      if (!els.memoriesMask.classList.contains('hidden')) { closeMemories(); return; }
      if (!els.personaMask.classList.contains('hidden')) { closePersonaEditor(); return; }
      if (els.profileMask && !els.profileMask.classList.contains('hidden')) { closeProfile(); return; }
      if (!els.characterMask.classList.contains('hidden')) { closeCharacterModal(); return; }
      if (!els.forwardMask.classList.contains('hidden')) { closeForwardModal(); return; }
      if (!els.createGroupMask.classList.contains('hidden')) { closeCreateGroup(); return; }
      if (!els.inviteMask.classList.contains('hidden')) {
        els.inviteMask.classList.add('hidden'); return;
      }
      if (!els.groupSetMask.classList.contains('hidden')) { closeGroupSet(); return; }
      if (!els.announceMask.classList.contains('hidden')) { closeAnnounce(); return; }
      if (!els.memberMenu.classList.contains('hidden')) {
        els.memberMenu.classList.add('hidden'); return;
      }
      if (!els.categoryMask.classList.contains('hidden')) {
        closeCategoryModal(); return;
      }
      if (!els.chatSettingsMask.classList.contains('hidden')) {
        closeChatSettings(); return;
      }
      if (!els.settingsMask.classList.contains('hidden')) {
        els.settingsMask.classList.add('hidden'); return;
      }
      if (state.userVoice.phase !== 'idle' && state.userVoice.phase !== 'sending') {
        resetVoiceRecorder(); return;
      }
      if (!els.convActions.classList.contains('hidden')) {
        closeConversationActions(true); return;
      }
      if (!els.convMenu.classList.contains('hidden')) {
        closeConversationMenu(true); return;
      }
      if (!els.mobileActions.classList.contains('hidden')) {
        closeMobileActions(true); return;
      }
      if (!els.mobileGlobalActions.classList.contains('hidden')) {
        closeMobileGlobalActions(true); return;
      }
      if (!els.contactsPage.classList.contains('hidden')) {
        els.contactsPage.classList.add('hidden');
        setMobileTab('messages');
        return;
      }
      if (!els.presenceMenu.classList.contains('hidden')) {
        els.presenceMenu.classList.add('hidden'); return;
      }
      if (!els.ctxMenu.classList.contains('hidden') || !els.moreMenu.classList.contains('hidden')) {
        closeCtx(); return;
      }
      if (!els.emojiPanel.classList.contains('hidden') ||
          !els.stickerPanel.classList.contains('hidden')) {
        hidePanels(); return;
      }
      if (state.selectMode) { exitSelectMode(); return; }
      if (!els.chatSearch.classList.contains('hidden')) {
        toggleChatSearch(false); return;
      }
      if (state.desktopView === 'contacts' &&
          window.matchMedia('(min-width: 881px)').matches) {
        if (els.desktopContactSearch.value.trim()) {
          els.desktopContactSearch.value = '';
          renderDesktopContacts();
          els.desktopContactSearch.focus();
        } else {
          setDesktopView('messages');
          els.railMessages.focus();
        }
      }
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f' &&
        !document.querySelector('.modal-mask:not(.hidden)')) {
      e.preventDefault();
      toggleChatSearch(true);
    }
  });

  function viewingChat() {
    return !window.matchMedia('(max-width: 880px)').matches ||
      els.appView.classList.contains('mobile-chat');
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopSpeech({ clearQueue: true, clearCache: true });
      stopVoicePlayback();
      resetVoiceRecorder();
      return;
    }
    if (viewingChat()) clearUnread();
    if (!state.connected) connect();
  });
  window.addEventListener('pagehide', () => {
    saveCurrentDraft();
    stopSpeech({ clearQueue: true, clearCache: true });
    stopVoicePlayback();
    resetVoiceRecorder();
  });
  window.addEventListener('focus', () => {
    if (viewingChat()) clearUnread();
  });

  // 心跳外的兜底：服务端每 25s 推一次 heartbeat，75s 没有任何帧就重连
  setInterval(() => {
    if (!state.ws || state.ws.readyState !== 1) return;
    if (Date.now() - state.lastFrame > 75000) {
      try { state.ws.close(); } catch (e) { /* ignore */ }
      return;
    }
    call('get_status', {}, 8000).catch(() => {});
  }, 30000);

  // 心情点不必秒级刷新：情绪是慢变量，一分钟同步一次就够。
  setInterval(async () => {
    if (document.hidden || !state.ready) return;
    if (await loadMoods()) {
      renderConvList();
      renderContactList();
      applyPeerIdentity();
    }
  }, 60000);

  // ---------------------------------------------------------- 启动
  // ---- 登录页：背景图 + 「我」的头像 ----
  // 背景默认用站点里的 23.png；用户点「更换背景」选的图存在本机 localStorage，
  // 下次打开直接生效（登录页在连接之前就要好看，不能等 WS）。
  const LS_LOGIN_BG = 'vol.loginBg';

  function applyLoginBg() {
    if (!els.connectBg) return;
    let bg = '';
    try { bg = localStorage.getItem(LS_LOGIN_BG) || ''; } catch (e) { bg = ''; }
    els.connectBg.style.backgroundImage = bg
      ? `url("${bg}")` : 'url("./23.png")';
  }

  function pickLoginBg() {
    els.connectBgInput.value = '';
    els.connectBgInput.click();
  }

  function saveLoginBg(file) {
    if (!file) return;
    if (!/^image\//.test(file.type || '')) { toast('请选择图片文件'); return; }
    if (file.size > 12 * 1024 * 1024) { toast('图片太大（上限 12MB）'); return; }
    const fr = new FileReader();
    fr.onload = () => {
      try { localStorage.setItem(LS_LOGIN_BG, String(fr.result)); } catch (e) { /* 满了就忽略 */ }
      applyLoginBg();
      toast('登录背景已更换');
    };
    fr.onerror = () => toast('读取失败');
    fr.readAsDataURL(file);
  }

  if (els.connectBgPick) els.connectBgPick.addEventListener('click', pickLoginBg);
  if (els.connectBgInput) {
    els.connectBgInput.addEventListener('change', () => {
      const f = els.connectBgInput.files && els.connectBgInput.files[0];
      saveLoginBg(f);
    });
  }

  // 登录页也要显示「我」的头像 —— 用 owner 的 QQ 头像 / 自定义头像
  async function loadLoginIdentity() {
    try {
      const res = await apiFetch('/api/identity', { cache: 'no-store' });
      if (!res.ok) return;
      const d = await res.json();
      if (!d || d.ok === false || !d.owner_id) return;
      state.me.id = Number(d.owner_id);
      state.me.name = d.owner_nickname || state.me.name;
      els.meName.textContent = state.me.name;
      els.mobileName.textContent = state.me.name;
      fillAvatar(els.brandAvatar, state.me.name, state.me.id, '我');
      fillAvatar(els.railAvatar, state.me.name, state.me.id, '我');
    } catch (e) { /* 老服务端没有这个接口 → 保留文字头像 */ }
  }

  function setupDesktopWindow() {
    const desktop = window.starlitDesktop;
    if (!desktop || desktop.platform === 'darwin' || typeof desktop.windowControl !== 'function') return;
    document.documentElement.classList.add('desktop-window');
    const maximize = $('#windowMaximize');
    const applyState = (windowState) => {
      const maximized = !!(windowState && windowState.maximized);
      maximize.setAttribute('aria-label', maximized ? '还原' : '最大化');
      maximize.title = maximized ? '还原' : '最大化';
      maximize.classList.toggle('is-maximized', maximized);
    };
    $('#windowMinimize').addEventListener('click', () => desktop.windowControl('minimize'));
    maximize.addEventListener('click', () => desktop.windowControl('maximize'));
    $('#windowClose').addEventListener('click', () => desktop.windowControl('close'));
    desktop.onWindowState(applyState);
    desktop.windowState().then(applyState).catch(() => {});
  }

  function init() {
    const qTheme = new URLSearchParams(location.search).get('theme');
    setupDesktopWindow();
    setupDialogA11y();
    setTheme(qTheme || localStorage.getItem(LS_THEME) || 'light');
    setImmersion(localStorage.getItem(LS_IMMERSION) === '1', false);
    appearancePrefs = sanitizeAppearance(readLocalMap(LS_APPEARANCE));
    applyAppearance(false);
    updateNotificationSettings();
    applyChatTheme();
    if (state.token) localStorage.setItem(LS_TOKEN, state.token);
    renderEmoji();
    setConn('warn', '连接中…');
    state.unread = totalUnread();
    updateBadges();
    autosize();
    updateSendBtn();
    els.tokenInput.value = state.token;
    // 自动连接期间不展开令牌栏；只有服务端明确拒绝鉴权时才显示。
    applyLoginBg();
    loadLoginIdentity();
    if (location.protocol !== 'file:') loadServiceSettings();
    if (window.StarlitUpdater) window.StarlitUpdater.init(apiFetch);
    connect();
  }

  init();
})();
