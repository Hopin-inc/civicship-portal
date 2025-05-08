"use client";

import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import {
  ContentType,
  DateFilter,
  Opportunity,
  Article,
  Activity,
} from "@/types";
import {
  mockActivities,
  mockOpportunities,
  mockArticles,
  mockCommunities,
} from "@/lib/data";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ActivityDetailHeader } from "@/components/features/activity/ActivityDetailHeader";
import { ActivityDetailContent } from "@/components/features/activity/ActivityDetailContent";
import { ActivityReservationSheet } from "@/components/features/activity/ActivityReservationSheet";
import { OpportunityDetailHeader } from "@/components/features/opportunity/OpportunityDetailHeader";
import { OpportunityDetailContent } from "@/components/features/opportunity/OpportunityDetailContent";
import { DateRange } from "react-day-picker";
import { ContentListSheet } from "./ContentListSheet";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Share2, X } from "lucide-react";
import { OpportunityConfirmModal } from "@/components/features/opportunity/OpportunityConfirmModal";
import { OpportunityCompletedModal } from "@/components/features/opportunity/OpportunityCompletedModal";

const containerStyle = {
  width: "100%",
  height: "100%",
};

// 四国の中心あたりに設定
const center = {
  lat: 33.8416,
  lng: 133.5336,
};

// シートが開いている時のマップ設定
const sheetOpenMapConfig = {
  center: {
    lat: 30.9, // より北に調整
    lng: 133.5336,
  },
  zoom: 7.5, // ズームレベルを微調整
};

// 通常時のマップ設定
const defaultMapConfig = {
  center,
  zoom: 8,
};

// シンプルな地図スタイル
const mapStyles = [
  {
    featureType: "all",
    elementType: "labels",
    stylers: [{ visibility: "simplified" }],
  },
  {
    featureType: "water",
    elementType: "geometry.fill",
    stylers: [
      { color: "#c8e0f4" }, // より濃い水色に調整
    ],
  },
  {
    featureType: "landscape",
    elementType: "geometry.fill",
    stylers: [
      { color: "#E6F5E6" }, // 陸地を白色に
    ],
  },
  {
    featureType: "administrative",
    elementType: "geometry.stroke",
    stylers: [
      { color: "#e3e3e3" }, // 行政区域の境界線を薄いグレーに
      { weight: 1 },
    ],
  },
  {
    featureType: "poi",
    elementType: "all",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "transit",
    elementType: "all",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "road",
    elementType: "all",
    stylers: [
      { visibility: "simplified" },
      { color: "#f5f5f5" }, // 道路を薄いグレーに
    ],
  },
  {
    featureType: "administrative",
    elementType: "labels",
    stylers: [{ visibility: "simplified" }],
  },
  {
    featureType: "administrative",
    elementType: "labels.text.fill",
    stylers: [
      { color: "#9ca3af" }, // 地域名の色を薄いグレーに
      { lightness: 30 },
    ],
  },
];

// カスタムマーカーのスタイル
const createCustomMarker = (imageUrl: string) => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) return null;

  // サイズ設定の調整
  const displaySize = 56; // 画像サイズを大きく
  const scale = 2; // 解像度スケール

  const canvasWidth = displaySize * scale;
  const canvasHeight = displaySize * scale;

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  canvas.style.width = `${displaySize}px`;
  canvas.style.height = `${displaySize}px`;

  context.scale(scale, scale);

  const img = document.createElement("img");
  img.crossOrigin = "anonymous"; // CORS対策
  img.src = imageUrl;

  return new Promise((resolve) => {
    img.onload = () => {
      const centerX = displaySize / 2;
      const centerY = displaySize / 2;
      const radius = displaySize / 2 - 2;

      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";

      // 外側の円（グラデーション）
      const gradient = context.createRadialGradient(
        centerX,
        centerY,
        radius - 2, // 余白を減らす
        centerX,
        centerY,
        radius + 2
      );
      gradient.addColorStop(0, "#C4A86D");
      gradient.addColorStop(1, "#9C8554");

      context.beginPath();
      context.arc(centerX, centerY, radius + 2, 0, 2 * Math.PI);
      context.fillStyle = gradient;
      context.fill();

      // 画像用の円形クリッピング（余白なし）
      context.beginPath();
      context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      context.clip();

      // 画像を正方形として中央に配置
      const imgSize = radius * 2;
      const imgAspect = img.width / img.height;
      let sourceX = 0;
      let sourceY = 0;
      let sourceWidth = img.width;
      let sourceHeight = img.height;

      // 画像の中央部分を正方形に切り抜く
      if (imgAspect > 1) {
        // 横長の画像
        sourceWidth = sourceHeight;
        sourceX = (img.width - sourceWidth) / 2;
      } else if (imgAspect < 1) {
        // 縦長の画像
        sourceHeight = sourceWidth;
        sourceY = (img.height - sourceHeight) / 2;
      }

      context.drawImage(
        img,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        centerX - imgSize / 2,
        centerY - imgSize / 2,
        imgSize,
        imgSize
      );

      resolve({
        url: canvas.toDataURL("image/png", 1.0),
        scaledSize: { width: displaySize, height: displaySize },
        anchor: { x: displaySize / 2, y: displaySize / 2 },
      });
    };

    img.onerror = () => {
      // エラー時のフォールバック処理
      const centerX = displaySize / 2;
      const centerY = displaySize / 2;

      context.beginPath();
      context.arc(centerX, centerY, displaySize / 2 - 4, 0, 2 * Math.PI);
      context.fillStyle = "#FFFFFF";
      context.fill();
      context.strokeStyle = "#666666";
      context.lineWidth = 2;
      context.stroke();

      resolve({
        url: canvas.toDataURL("image/png", 1.0),
        scaledSize: { width: displaySize, height: displaySize },
        anchor: { x: displaySize / 2, y: displaySize / 2 },
      });
    };
  });
};

// 型定義を追加
type MarkerType = {
  position: google.maps.LatLngLiteral;
  id: string;
  icon: any;
  contentType: ContentType;
};

type ContentItem = Opportunity | Article;

type ImageObject = {
  url: string;
  caption?: string;
};

type SelectedContent = {
  type: ContentType;
  item: Opportunity | Article;
} | null;

type MapViewProps = {
  defaultSelectedType?: ContentType;
};

export default function MapView({
  defaultSelectedType = "EXPERIENCE",
}: MapViewProps) {
  const [selectedType, setSelectedType] =
    useState<ContentType>(defaultSelectedType);
  const [selectedContent, setSelectedContent] = useState<SelectedContent>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [markers, setMarkers] = useState<MarkerType[]>([]);
  const [mapConfig, setMapConfig] = useState(defaultMapConfig);
  const [dateFilter, setDateFilter] = useState<DateFilter>({
    startDate: null,
    endDate: null,
  });
  const [isOnlineListOpen, setIsOnlineListOpen] = useState(false);
  const [showButton, setShowButton] = useState(true);
  const [showOnlineList, setShowOnlineList] = useState(true);
  const [sheetState, setSheetState] = useState<"closed" | "half" | "full">(
    "half"
  );
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [onlineItems, setOnlineItems] = useState<(Opportunity)[]>(
    []
  );
  const [previousFilter, setPreviousFilter] = useState({
    type: selectedType,
    startDate: dateFilter.startDate,
    endDate: dateFilter.endDate,
  });

  const [reservationItem, setReservationItem] = useState<Activity | null>(null);

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: dateFilter.startDate || undefined,
    to: dateFilter.endDate || undefined,
  });
  const [listDragState, setListDragState] = useState<
    "closed" | "half" | "full"
  >("half");
  const [listLastScrollTop, setListLastScrollTop] = useState(0);
  const [reservationSheetOpen, setReservationSheetOpen] = useState(false);
  const [filteredItems, setFilteredItems] = useState<ContentItem[]>([]);
  const [isJoined, setIsJoined] = useState(false);
  const [isConfirmSheetOpen, setIsConfirmSheetOpen] = useState(false);
  const [isCompletedSheetOpen, setIsCompletedSheetOpen] = useState(false);

  // タブ切り替え時にシートをリセットし、マーカーとリストを更新
  useEffect(() => {
    setSelectedContent(null);
    setSheetState("half");
    setDateFilter({ startDate: null, endDate: null }); // 日付フィルターをリセット
    setDateRange(undefined); // カレンダーの選択状態をリセット
  }, [selectedType]);

  const getContentCounts = () => {
    const counts: Record<ContentType, number> = {
      EXPERIENCE: mockActivities.length,
      QUEST: mockOpportunities.filter((opp) => opp.type === "QUEST").length,
      EVENT: mockOpportunities.filter((opp) => opp.type === "EVENT").length,
      ARTICLE: mockArticles.length,
    };
    return counts;
  };

  const getFilteredCounts = () => {
    const counts: Record<ContentType, number> = {
      EXPERIENCE: filterContent(mockActivities).length,
      QUEST: filterContent(
        mockOpportunities.filter((opp) => opp.type === "QUEST")
      ).length,
      EVENT: filterContent(
        mockOpportunities.filter((opp) => opp.type === "EVENT")
      ).length,
      ARTICLE: filterContent(mockArticles).length,
    };
    return counts;
  };

  const filterContent = (items: ContentItem[]): ContentItem[] => {
    return items.filter((item) => {
      if (!dateFilter.startDate && !dateFilter.endDate) {
        return true;
      }

      if (
        "schedule" in item &&
        "location" in item &&
        "isOnline" in item.location &&
        item.location.isOnline
      ) {
        // 体験アクティビティの場合
        const { daysOfWeek } = item.schedule;

        // 指定された期間内の各日をチェック
        const startDate = dateFilter.startDate || new Date();
        const endDate = dateFilter.endDate || startDate;

        // 期間内の日付を1日ずつチェック
        let currentDate = new Date(startDate);
        while (currentDate <= endDate) {
          // その日の曜日が開催曜日に含まれているかチェック
          if (daysOfWeek.includes(currentDate.getDay())) {
            return true; // 該当する曜日があれば表示
          }
          // 次の日へ
          currentDate.setDate(currentDate.getDate() + 1);
        }
        return false;
      } else if ("startsAt" in item) {
        // イベントやクエストの場合
        const itemStartDate = new Date(item.startsAt);
        const itemEndDate = new Date(item.endsAt);

        if (dateFilter.startDate && dateFilter.endDate) {
          return (
            (itemStartDate <= dateFilter.endDate &&
              itemEndDate >= dateFilter.startDate) ||
            (itemStartDate >= dateFilter.startDate &&
              itemStartDate <= dateFilter.endDate)
          );
        } else if (dateFilter.startDate) {
          return itemEndDate >= dateFilter.startDate;
        } else if (dateFilter.endDate) {
          return itemStartDate <= dateFilter.endDate;
        }
      } else if ("publishedAt" in item) {
        // 記事の場合
        const publishDate = new Date(item.publishedAt);

        if (dateFilter.startDate && dateFilter.endDate) {
          return (
            publishDate >= dateFilter.startDate &&
            publishDate <= dateFilter.endDate
          );
        } else if (dateFilter.startDate) {
          return publishDate >= dateFilter.startDate;
        } else if (dateFilter.endDate) {
          return publishDate <= dateFilter.endDate;
        }
      }

      return true;
    });
  };

  const getFilteredItems = () => {
    console.log("[getFilteredItems] selectedType:", selectedType);
    if (!selectedType) return [];

    let items: ContentItem[] = [];
    switch (selectedType) {
      case "EXPERIENCE":
        items = mockActivities;
        break;
      case "QUEST":
        items = mockOpportunities.filter(
          (opp) => opp.type === "QUEST" && !opp.id.includes("past")
        );
        break;
      case "EVENT":
        items = mockOpportunities.filter(
          (opp) => opp.type === "EVENT" && !opp.id.includes("past")
        );
        break;
      case "ARTICLE":
        items = mockArticles;
        break;
    }
    // Remove duplicates by ID and log any duplicates found
    const uniqueItems = items.reduce((acc, current) => {
      const x = acc.find((item) => item.id === current.id);
      if (!x) {
        return acc.concat([current]);
      } else {
        console.warn(
          "[getFilteredItems] Found duplicate item with ID:",
          current.id
        );
        return acc;
      }
    }, [] as ContentItem[]);

    console.log(
      "[getFilteredItems] Raw items:",
      uniqueItems.map((item) => ({
        id: item.id,
        type: "type" in item ? item.type : "EXPERIENCE",
      }))
    );

    const filteredItems = filterContent(uniqueItems);
    console.log(
      "[getFilteredItems] filtered items length:",
      filteredItems.length
    );
    console.log(
      "[getFilteredItems] Filtered items:",
      filteredItems.map((item) => ({
        id: item.id,
        type: "type" in item ? item.type : "EXPERIENCE",
      }))
    );
    return filteredItems;
  };

  // フィルタリングされたアイテムの更新
  useEffect(() => {
    console.log(
      "[filteredItems useEffect] selectedType changed:",
      selectedType
    );
    const items = getFilteredItems();
    console.log("[filteredItems useEffect] setting items:", items.length);
    setFilteredItems(items);
  }, [selectedType, dateFilter]);

  useEffect(() => {
    console.log(
      "[loadMarkers] Starting to load markers for type:",
      selectedType
    );
    const loadMarkers = async () => {
      let contentItems: ContentItem[] = [];
      let onlineContentItems: (Opportunity | Activity)[] = [];

      switch (selectedType) {
        case "EXPERIENCE":
          contentItems = filterContent(mockActivities);
          onlineContentItems = contentItems.filter(
            (item): item is Activity =>
              "schedule" in item &&
              "location" in item &&
              typeof item.location === "object" &&
              item.location !== null &&
              "isOnline" in item.location &&
              Boolean(item.location.isOnline)
          );
          break;
        case "QUEST":
        case "EVENT":
          const opportunities = mockOpportunities.filter(
            (opp) => opp.type === selectedType
          );
          contentItems = filterContent(opportunities);
          onlineContentItems = contentItems.filter(
            (item): item is Opportunity =>
              "location" in item &&
              "isOnline" in item.location &&
              item.location.isOnline
          );
          break;
        case "ARTICLE":
          contentItems = filterContent(mockArticles);
          break;
      }

      const markerPromises = await Promise.all(
        contentItems.map(async (item) => {
          let imageUrl: string = "/default-image.jpg";
          let location: { lat?: number; lng?: number };

          if ("images" in item && item.images && item.images.length > 0) {
            // Activity
            const firstImage = item.images[0];
            imageUrl =
              typeof firstImage === "string" ? firstImage : firstImage.url;
            location = item.location;
          } else if ("image" in item && item.image) {
            // Opportunity type
            const image = item.image;
            if (typeof image === "string") {
              imageUrl = image;
            } else {
              const imageObj = item.image;
              if (
                typeof imageObj === "object" &&
                imageObj !== null &&
                "url" in imageObj &&
                typeof (imageObj as ImageObject).url === "string"
              ) {
                imageUrl = (imageObj as ImageObject).url;
              }
            }
            location = item.location;
          } else if ("thumbnail" in item) {
            // Article
            imageUrl = item.thumbnail;
            location = { lat: 0, lng: 0 }; // You'll need to implement this
          } else {
            // Default image for items without images
            location = "location" in item ? item.location : { lat: 0, lng: 0 };
          }

          const localImageUrl = `/images/activities/${
            typeof imageUrl === "string"
              ? imageUrl.split("/").pop()
              : "default-image.jpg"
          }`;
          const icon = await createCustomMarker(localImageUrl);

          if (!location.lat || !location.lng) {
            return null;
          }

          return {
            position: {
              lat: location.lat,
              lng: location.lng,
            },
            id: item.id,
            icon,
            contentType: selectedType,
          } as MarkerType;
        })
      );

      const validMarkers = markerPromises.filter(
        (marker): marker is MarkerType => marker !== null
      );
      setMarkers(validMarkers);

      setOnlineItems(onlineContentItems);
    };

    loadMarkers();
  }, [selectedType, dateFilter]);

  useEffect(() => {
    const currentFilter = {
      type: selectedType,
      startDate: dateFilter.startDate,
      endDate: dateFilter.endDate,
    };

    if (
      currentFilter.type !== previousFilter.type ||
      currentFilter.startDate !== previousFilter.startDate ||
      currentFilter.endDate !== previousFilter.endDate
    ) {
      setShowOnlineList(true);
      setPreviousFilter(currentFilter);
    }
  }, [selectedType, dateFilter]);

  const handleMarkerClick = (markerId: string) => {
    let selectedItem = null;

    switch (selectedType) {
      case "EXPERIENCE":
        selectedItem = mockActivities.find((a) => a.id === markerId);
        if (selectedItem) {
          setSelectedContent({ type: "EXPERIENCE", item: selectedItem });
          setSheetState("half");
        }
        break;
      case "QUEST":
      case "EVENT":
        selectedItem = mockOpportunities.find((o) => o.id === markerId);
        if (selectedItem) {
          setSelectedContent({ type: selectedType, item: selectedItem });
          setSheetState("half");
        }
        break;
      case "ARTICLE":
        selectedItem = mockArticles.find((a) => a.id === markerId);
        if (selectedItem) {
          setSelectedContent({ type: "ARTICLE", item: selectedItem });
          setSheetState("half");
        }
        break;
    }
  };

  const handleDragEnd = (event: any, info: any) => {
    const velocity = info.velocity.y;
    const offset = info.offset.y;

    if (velocity > 500 || offset > 100) {
      // 下に強くドラッグまたは大きく移動した場合
      if (sheetState === "full") {
        setSheetState("half");
      } else if (sheetState === "half") {
        handleClose();
      }
    } else if (velocity < -500 || offset < -100) {
      // 上に強くドラッグまたは大きく移動した場合
      setSheetState("full");
    } else {
      // 小さな移動の場合は現在の状態を維持
      setSheetState(sheetState);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop } = e.currentTarget;

    if (sheetState === "half") {
      // half状態で下スクロールしたらfullに
      if (scrollTop > 20) {
        setSheetState("full");
      }
    } else if (sheetState === "full") {
      // full状態で一番上まで行って、さらに上スクロールしたらhalfに
      if (scrollTop === 0) {
        const isScrollingUp = lastScrollTop > scrollTop;
        if (isScrollingUp) {
          setSheetState("half");
        }
      }
    }

    setLastScrollTop(scrollTop);
  };

  const handleMapClick = () => {
    if (sheetState === "full") {
      // full状態でマップをクリックしたらhalfに
      setSheetState("half");
    } else if (selectedContent && sheetState === "half") {
      // 詳細シートが表示されていて、half状態でマップをクリックしたら閉じる
      handleClose();
    }
  };

  const handleClose = () => {
    console.log('handleClose')
    setSelectedContent(null);
    setSheetState("closed");
    setReservationItem(null);
    setReservationSheetOpen(false);
  };

  const handleOnlineItemClick = (item: Opportunity | Activity) => {
    setSelectedContent({
      type: "schedule" in item ? "EXPERIENCE" : item.type,
      item,
    });
    setSheetState("full");
  };

  const handleCloseOnlineList = () => {
    setShowOnlineList(false);
  };

  const handleReservationClick = (activity: Activity) => {
    setReservationItem(activity);
    setReservationSheetOpen(true);
  };

  const handleReservationClose = () => {
    setReservationSheetOpen(false);
    setReservationItem(null);
  };

  const handleApply = () => {
    setIsConfirmSheetOpen(true);
  };

  const handleConfirmJoin = () => {
    setIsConfirmSheetOpen(false);
    setIsCompletedSheetOpen(true);
    setIsJoined(true);
  };

  const handleCancelJoin = () => {
    setIsJoined(false);
  };

  const getButtonLabel = (isEvent: boolean, isFull: boolean) => {
    if (isFull) return "満員です";
    if (!isJoined) return isEvent ? "参加する" : "応募する";
    return isEvent ? "参加予定" : "応募済み（未確定）";
  };

  const renderDetailContent = () => {
    if (!selectedContent) return null;

    const { type, item } = selectedContent;

    switch (type) {
      case "EXPERIENCE":
        return (
          <>
            <ActivityDetailHeader activity={item as Activity} />
            <ActivityDetailContent
              activity={item as Activity}
              onReservationClick={handleReservationClick}
            />
            {reservationItem && (
              <ActivityReservationSheet
                activity={reservationItem}
                isOpen={reservationSheetOpen}
                onOpenChange={setReservationSheetOpen}
                selectedDate={undefined}
                onSelectDate={() => {}}
                onConfirm={() => setReservationSheetOpen(false)}
              />
            )}
          </>
        );
      case "QUEST":
      case "EVENT":
        const opportunity = item as Opportunity;
        const community = opportunity?.communityId
          ? mockCommunities.find((p) => p.id === opportunity.communityId)
          : null;
        const isEvent = opportunity?.type === "EVENT";
        const isFull =
          opportunity?.participants && opportunity?.capacity
            ? opportunity.participants.length >= opportunity?.capacity
            : false;
        const userPoints = 0; // TODO: Get actual user points
        const hasEnoughPoints = true; // TODO: Calculate based on actual points

        return (
          <div className="flex flex-col min-h-[calc(100vh-4rem)]">
            <div className="flex-1">
              <OpportunityDetailHeader opportunity={opportunity} />
              <OpportunityDetailContent
                opportunity={opportunity}
                community={community ?? null}
                userPoints={userPoints}
                hasEnoughPoints={hasEnoughPoints}
                onParticipantsClick={() => {}}
              />
            </div>
            <div className="sticky bottom-0 w-full bg-background/80 backdrop-blur-sm border-t">
              <div className="container max-w-lg mx-auto p-4 flex gap-2">
                {isJoined ? (
                  <>
                    <Button className="flex-1" variant="secondary">
                      {isEvent ? "参加予定" : "応募済み（未確定）"}
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="icon">
                          <MoreVertical className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={handleCancelJoin}
                          className="text-destructive"
                        >
                          参加をキャンセル
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button variant="secondary" onClick={() => {}}>
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      className="flex-1"
                      onClick={handleApply}
                      disabled={isFull || !hasEnoughPoints}
                    >
                      {getButtonLabel(isEvent, isFull)}
                    </Button>
                    <Button variant="secondary" onClick={() => {}}>
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </>
                )}
              </div>
            </div>
            <OpportunityConfirmModal
              isOpen={isConfirmSheetOpen}
              onClose={() => setIsConfirmSheetOpen(false)}
              onConfirm={handleConfirmJoin}
              opportunity={opportunity}
              isJoined={isJoined}
              isEvent={isEvent}
            />
            <OpportunityCompletedModal
              isOpen={isCompletedSheetOpen}
              onClose={() => setIsCompletedSheetOpen(false)}
              opportunity={opportunity}
              isJoined={isJoined}
              isEvent={isEvent}
              onShare={() => {}}
              onAddToCalendar={() => {}}
            />
          </div>
        );
      case "ARTICLE":
        const article = item as Article;
        return (
          <>
            <div className="relative">
              <div className="aspect-video w-full overflow-hidden">
                <img
                  src={article.thumbnail}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-bold mb-2">{article.title}</h2>
                <p className="text-gray-600 mb-4">
                  {new Date(article.publishedAt).toLocaleDateString()}
                </p>
                <p className="text-gray-600 whitespace-pre-wrap">
                  {article.description}
                </p>
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">著者</h3>
                  <div className="flex items-center">
                    <img
                      src={article.author.image}
                      alt={article.author.name}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <p className="font-medium">{article.author.name}</p>
                      {article.author.bio && (
                        <p className="text-sm text-gray-600">
                          {article.author.bio}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const handleListItemClick = (item: ContentItem) => {
    handleMarkerClick(item.id);
    setSheetState("full");
  };

  return (
    <div className="relative w-full h-full">
      <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={mapConfig.center}
          zoom={mapConfig.zoom}
          options={{
            styles: mapStyles,
            disableDefaultUI: true,
            zoomControl: true,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
          }}
          onDragEnd={handleDragEnd}
          onClick={handleMapClick}
        >
          {markers.map((marker) => (
            <Marker
              key={marker.id}
              position={marker.position}
              icon={marker.icon}
              onClick={() => handleMarkerClick(marker.id)}
            />
          ))}
        </GoogleMap>
      </LoadScript>

      <AnimatePresence>
        {!selectedContent && sheetState !== "closed" && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: sheetState === "full" ? 0 : "35vh" }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute bottom-0 left-0 right-0 bg-background rounded-t-3xl shadow-lg overflow-hidden"
            style={{ maxHeight: sheetState === "full" ? "85vh" : "65vh" }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
          >
            {/* ドラッグハンドル */}
            <div className="sticky top-0 w-full flex justify-between items-center pt-2 pb-1 bg-background z-10">
              <div className="w-full flex justify-center">
                <div className="w-12 h-1 rounded-full bg-muted-foreground/20" />
              </div>
              <Button
                variant="text"
                size="icon"
                className="absolute right-2 top-2"
                onClick={handleClose}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div
              className="overflow-y-auto"
              style={{ maxHeight: sheetState === "full" ? "85vh" : "65vh" }}
              onScroll={handleScroll}
            >
              <ContentListSheet
                items={filteredItems}
                onItemClick={handleListItemClick}
                selectedType={selectedType}
                onTypeChange={(type) => {
                  console.log("[ContentListSheet] onTypeChange:", type);
                  setSelectedType(type);
                }}
                dateFilter={dateFilter}
                onDateFilterChange={setDateFilter}
                getContentCounts={getContentCounts}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedContent && sheetState !== "closed" && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: sheetState === "full" ? 0 : "35vh" }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute bottom-0 left-0 right-0 bg-background rounded-t-3xl shadow-lg overflow-hidden"
            style={{ maxHeight: sheetState === "full" ? "85vh" : "65vh" }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
          >
            {/* ドラッグハンドル */}
            <div className="sticky top-0 w-full flex justify-between items-center pt-2 pb-1 bg-background z-10">
              <div className="w-full flex justify-center">
                <div className="w-12 h-1 rounded-full bg-muted-foreground/20" />
              </div>
              <Button
                variant="text"
                size="icon"
                className="absolute right-2 top-2"
                onClick={handleClose}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div
              className="overflow-y-auto"
              style={{ maxHeight: sheetState === "full" ? "85vh" : "65vh" }}
              onScroll={handleScroll}
            >
              {renderDetailContent()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
