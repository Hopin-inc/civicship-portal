import { z } from "zod";

/**
 * ドメイン名のバリデーション正規表現
 * 例: example.com, sub.example.com, localhost
 */
const DOMAIN_REGEX = /^(?:localhost|(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,})$/;

/**
 * ファビコンプレフィックスのバリデーション正規表現
 * 例: favicon, my-favicon, favicon123
 */
const FAVICON_PREFIX_REGEX = /^[a-zA-Z0-9-_]+$/;

/**
 * パスのバリデーション正規表現
 * 例: /path/to/file, /images/logo.png
 */
const PATH_REGEX = /^\/[a-zA-Z0-9/_.-]*$/;

/**
 * ポータル設定のZodスキーマを作成する
 * 翻訳関数を受け取り、ローカライズされたエラーメッセージを使用
 */
export const createPortalConfigSchema = (t: (key: string) => string) =>
  z.object({
    // 基本情報
    title: z
      .string({ required_error: t("titleRequired") })
      .trim()
      .min(1, t("titleRequired"))
      .max(100, t("titleMaxLength")),

    description: z
      .string({ required_error: t("descriptionRequired") })
      .trim()
      .min(1, t("descriptionRequired"))
      .max(500, t("descriptionMaxLength")),

    shortDescription: z
      .string()
      .trim()
      .max(200, t("shortDescriptionMaxLength"))
      .nullable()
      .optional(),

    // トークン設定
    tokenName: z
      .string({ required_error: t("tokenNameRequired") })
      .trim()
      .min(1, t("tokenNameRequired"))
      .max(50, t("tokenNameMaxLength")),

    // ドメイン設定
    domain: z
      .string({ required_error: t("domainRequired") })
      .trim()
      .min(1, t("domainRequired"))
      .regex(DOMAIN_REGEX, t("domainInvalid")),

    // ファビコン設定
    faviconPrefix: z
      .string({ required_error: t("faviconPrefixRequired") })
      .trim()
      .min(1, t("faviconPrefixRequired"))
      .regex(FAVICON_PREFIX_REGEX, t("faviconPrefixInvalid")),

    // 画像パス設定
    logoPath: z
      .string({ required_error: t("logoPathRequired") })
      .trim()
      .min(1, t("logoPathRequired"))
      .regex(PATH_REGEX, t("pathInvalid")),

    squareLogoPath: z
      .string({ required_error: t("squareLogoPathRequired") })
      .trim()
      .min(1, t("squareLogoPathRequired"))
      .regex(PATH_REGEX, t("pathInvalid")),

    ogImagePath: z
      .string({ required_error: t("ogImagePathRequired") })
      .trim()
      .min(1, t("ogImagePathRequired"))
      .regex(PATH_REGEX, t("pathInvalid")),

    // ルートパス設定
    rootPath: z
      .string({ required_error: t("rootPathRequired") })
      .trim()
      .min(1, t("rootPathRequired"))
      .regex(PATH_REGEX, t("pathInvalid")),

    adminRootPath: z
      .string({ required_error: t("adminRootPathRequired") })
      .trim()
      .min(1, t("adminRootPathRequired"))
      .regex(PATH_REGEX, t("pathInvalid")),

    // リージョン設定（オプション）
    regionName: z.string().trim().max(100, t("regionNameMaxLength")).nullable().optional(),

    regionKey: z.string().trim().max(50, t("regionKeyMaxLength")).nullable().optional(),

    // 機能フラグ
    enableFeatures: z.array(z.string()).default([]),

    // LIFF設定（オプション）
    liffId: z.string().trim().nullable().optional(),
    liffAppId: z.string().trim().nullable().optional(),
    liffBaseUrl: z
      .string()
      .trim()
      .url(t("liffBaseUrlInvalid"))
      .nullable()
      .optional()
      .or(z.literal("")),

    // Firebase設定（オプション）
    firebaseTenantId: z.string().trim().nullable().optional(),
  });

/**
 * ポータル設定のフォーム値の型
 */
export type PortalConfigFormValues = z.infer<ReturnType<typeof createPortalConfigSchema>>;

/**
 * ポータル設定のデフォルト値
 */
export const defaultPortalConfigValues: Partial<PortalConfigFormValues> = {
  title: "",
  description: "",
  shortDescription: null,
  tokenName: "",
  domain: "",
  faviconPrefix: "",
  logoPath: "",
  squareLogoPath: "",
  ogImagePath: "",
  rootPath: "/",
  adminRootPath: "/admin",
  regionName: null,
  regionKey: null,
  enableFeatures: [],
  liffId: null,
  liffAppId: null,
  liffBaseUrl: null,
  firebaseTenantId: null,
};
