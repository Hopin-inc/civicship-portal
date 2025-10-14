"use client";
import { Button } from "@/components/ui/button";
import LoginModal from "@/app/login/components/LoginModal";
import PaymentSection from "@/app/reservation/confirm/components/PaymentSection";
import { useReservationConfirm } from "@/app/reservation/confirm/hooks/useReservationConfirm";
import { useAuth } from "@/contexts/AuthProvider";
import { useTicketCounter } from "@/app/reservation/confirm/hooks/useTicketCounter";
import { useReservationParams } from "@/app/reservation/confirm/hooks/useReservationParams";
import { notFound, useRouter } from "next/navigation";
import { HeaderConfig } from "@/contexts/HeaderContext";
import { useEffect, useMemo, useRef, useState } from "react";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { toast } from "sonner";
import { useReservationUIState } from "@/app/reservation/confirm/hooks/useReservationUIState";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from '@/components/shared'
import { CommentTextarea } from "./components/ParticipationAge";
import { errorMessages } from "@/utils/errorMessage";
import { useReservationCommand } from "@/app/reservation/confirm/hooks/useReservationAction";
import { GqlOpportunityCategory, GqlWalletType, useGetMemberWalletsQuery } from "@/types/graphql";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { logger } from "@/lib/logging";
import { RawURIComponent } from "@/utils/path";
import { NoticeCard } from "@/components/shared/NoticeCard";
import { ReservationConfirmationCard } from "@/app/reservation/confirm/components/ReservationConfirmationCard";
import { ExpectedPoints } from "./components/ExpectedPoints";
import { PaymentSummary } from "./components/PaymentSummary";
import { isActivityCategory, isQuestCategory } from "@/components/domains/opportunities/types";

export default function ConfirmPage() {
  const headerConfig: HeaderConfig = useMemo(
    () => ({
      title: "申込内容の確認",
      showLogo: false,
      showBackButton: true,
    }),
    [],
  );
  useHeaderConfig(headerConfig);
  const { user,isAuthenticated } = useAuth();
  const router = useRouter();

  const {
    opportunityId,
    slotId,
    participantCount: initialParticipantCount,
    communityId,
  } = useReservationParams();

  const [participantCount, setParticipantCount] = useState<number>(initialParticipantCount);
  const [selectedPointCount, setSelectedPointCount] = useState(0);
  const [selectedTicketCount, setSelectedTicketCount] = useState(0);
  const [selectedTickets, setSelectedTickets] = useState<{ [ticketId: string]: number }>({});

  const getButtonText = () => {
    if (creatingReservation) {
      return "申込処理中...";
    }
    if (user) {
      return "申し込みをする";
    }
    return "LINEで登録に進む";
  };

  const {
    opportunity,
    selectedSlot,
    wallets,
    startDateTime,
    endDateTime,
    availableTickets,
    loading,
    hasError,
    triggerRefetch,
  } = useReservationConfirm({ opportunityId, slotId, userId: user?.id });

  const { data: walletData } = useGetMemberWalletsQuery({
    variables: {
      filter: {
        userId: user?.id,
        type: GqlWalletType.Member,
      },
    },
  });
  const userWallet:number | null = walletData?.wallets?.edges?.find((edge) => edge?.node?.user?.id === user?.id)?.node?.currentPointView?.currentPoint;
  const refetchRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    refetchRef.current = triggerRefetch;
  }, [triggerRefetch]);

  const ticketCounter = useTicketCounter(availableTickets.length);
  const ui = useReservationUIState();
  const { handleReservation, creatingReservation } = useReservationCommand();

  useEffect(() => {
    if (!opportunity) return;
    
    const feeRequired = 'feeRequired' in opportunity ? opportunity.feeRequired : null;
    const pointsRequired = 'pointsRequired' in opportunity ? opportunity.pointsRequired : 0;
    
    if ((feeRequired === null || feeRequired === 0) && pointsRequired > 0) {
      ui.setUsePoints(true);
    }
  }, [opportunity, ui]);

  if (loading) return <LoadingIndicator />;
  if (hasError)
    return <ErrorState title="予約情報を読み込めませんでした" refetchRef={ refetchRef } />;
  if (!opportunity) return notFound();

  const feeRequired = 'feeRequired' in opportunity ? opportunity.feeRequired : null;
  const pointsRequired = 'pointsRequired' in opportunity ? opportunity.pointsRequired : 0;

  const handleConfirm = async () => {
    const result = await handleReservation({
      opportunity,
      selectedSlot,
      wallets,
      user: user ?? null,
      ticketCounter,
      participantCount,
      useTickets: ui.useTickets,
      comment: ui.ageComment ?? undefined,
      usePoints: ui.usePoints,
      selectedPointCount: selectedPointCount,
      selectedTicketCount: selectedTicketCount,
      selectedTickets: selectedTickets,
    });

    if (creatingReservation) {
      return <LoadingIndicator fullScreen />;
    }

    if (!result.success) {
      if (!user) {
        ui.setIsLoginModalOpen(true);
      } else {
        const message = errorMessages[result.code] ?? "予期しないエラーが発生しました。";
        toast.error(message);
        logger.error("Reservation failed", {
          code: result.code,
          component: "ReservationConfirmPage",
        });
      }
      return;
    }
    toast.success("申し込みが完了しました。");
    const participationCount = result.reservation.participations?.length ?? 1;
    const query = new URLSearchParams({
      id: opportunityId,
      community_id: communityId ?? "",
      reservation_id: result.reservation.id,
      guests: participationCount.toString(),
    });
    router.push(`/reservation/complete?${ query.toString() }`);
  };
  const isActivity = opportunity.category === GqlOpportunityCategory.Activity;
  const isQuest = opportunity.category === GqlOpportunityCategory.Quest;
  const maxTickets = availableTickets.reduce((sum, ticket) => sum + ticket.count, 0);
  const isPointsOnly = (feeRequired === null || feeRequired === 0) && pointsRequired > 0;
  const totalPointsRequired = pointsRequired * participantCount;
  const hasInsufficientPoints = isPointsOnly && (!userWallet || userWallet < totalPointsRequired);
  return (
    <>
      <main className="min-h-screen">
        <LoginModal
          isOpen={ ui.isLoginModalOpen }
          onClose={ () => ui.setIsLoginModalOpen(false) }
          nextPath={ window.location.pathname + window.location.search as RawURIComponent }
        />
        <div className="px-6 py-4">
          <NoticeCard title="申し込みは未確定です。" description="最後までご確認いただき確定させて下さい" />
        </div>
        <div className="mx-6 py-4 mt-2 border p-4 rounded-xl">
          <ReservationConfirmationCard
            opportunity={ {
              id: opportunity.id,
              title: opportunity.title,
              feeRequired:'feeRequired' in opportunity ? opportunity.feeRequired : null,
              category: GqlOpportunityCategory.Activity,
              communityId: COMMUNITY_ID,
              images: opportunity.images,
              location: opportunity.place.name,
              hasReservableTicket: false,
              pointsRequired: 'pointsRequired' in opportunity ? opportunity.pointsRequired : null,
              slots: [],
            } }
            startDateTime={ startDateTime ?? null }
            endDateTime={ endDateTime ?? null }
            category={ opportunity.category }
            withShadow={ false }
            participantCount={ participantCount }
            onChange={ setParticipantCount }
          />
        </div>
        <div className="mx-6 border-b border-gray-200 my-6"></div>
        {isActivity && (pointsRequired > 0 || maxTickets > 0) ? (
          <>
          <PaymentSection
            ticketCount={ ticketCounter.count }
            onIncrement={ ticketCounter.increment }
            onDecrement={ ticketCounter.decrement }
            maxTickets={ maxTickets }
            availableTickets={ availableTickets }
            pricePerPerson={ 'feeRequired' in opportunity ? opportunity.feeRequired : null }
            participantCount={ participantCount }
            useTickets={ ui.useTickets }
            setUseTickets={ ui.setUseTickets }
            userWallet={ userWallet }
            usePoints={ ui.usePoints }
            setUsePoints={ ui.setUsePoints }
            pointsRequired={ 'pointsRequired' in opportunity ? opportunity.pointsRequired : 0 }
            onPointCountChange={setSelectedPointCount}
            onTicketCountChange={setSelectedTicketCount}
            onSelectedTicketsChange={setSelectedTickets}
            forcePointsEnabled={(feeRequired === null || feeRequired === 0) && pointsRequired > 0}
          />
          <div className="border-b border-gray-200 my-6"></div>
          </>
        ) : null }
        <div className="mb-2" />
        {/* <NotesSection /> */}
        <CommentTextarea
          title={"主催者への伝言"}
          description={"案内人の事前準備が変わる場合があるため、参加者の年齢等の記入にご協力ください"} 
          placeholder="例）51歳、5歳で参加します"
          value={ui.ageComment}
          onChange={ui.setAgeComment}
        />
        <div className="mb-4 mt-2" />
        <div className="mx-6 border-b border-gray-200 my-6"></div>
        {isQuest && (
          <>
            <ExpectedPoints 
              points={isQuestCategory(opportunity) ? opportunity.pointsToEarn * participantCount : null}
              participantCount={participantCount} />
            <div className="border-b border-gray-200 my-6"></div>
          </>
        )}
        {isActivity && (
          <div className="mx-6">
            <PaymentSummary
              pricePerPerson={ isActivityCategory(opportunity) ? opportunity.feeRequired : null }
              participantCount={ participantCount }
              useTickets={ ui.useTickets }
              ticketCount={ selectedTicketCount }
              usePoints={ ui.usePoints }
              pointCount={ selectedPointCount }
              pointsRequired={pointsRequired ? opportunity.pointsRequired : null }
              isPointsOnly={(feeRequired === null || feeRequired === 0) && pointsRequired > 0}
            />
            <div className="border-b border-gray-200 my-6"></div>
          </div>
        )}
        <footer className="max-w-mobile-l w-full flex flex-col items-center px-4 py-4 justify-between mx-auto">
          {isAuthenticated ? (
          <>
            <Button
              size="lg"
              className="mx-auto px-20"
              onClick={ handleConfirm }
              disabled={
                creatingReservation || (ui.useTickets && ticketCounter.count > availableTickets.length) || hasInsufficientPoints
              }
            >
              { getButtonText() }
            </Button>
            {hasInsufficientPoints && (
              <p className="text-body-sm text-red-500 mt-2">
                ポイントが不足しているため申し込みできません
              </p>
            )}
          </>
        ) : (
          <Button
            size="lg"
            variant="secondary"
            className="mx-auto px-20"
            onClick={ () => ui.setIsLoginModalOpen(true) }
          >
            <p className="whitespace-pre-line">
              <span className="text-label-md font-bold">LINEログインして</span>
              <br />
              <span className="text-label-lg pt-1 font-bold">申し込む</span>
            </p>
          </Button>
        )}
        </footer>
      </main>
    </>
  );
}
