"use client";

import { Button } from "@/components/ui/button";
import LoginModal from "@/app/community/[communityId]/login/components/LoginModal";
import { ReservationConfirmationCard } from "@/app/community/[communityId]/reservation/confirm/components/ReservationConfirmationCard";
import { NoticeCard } from "@/components/shared/NoticeCard";
import { GqlCurrentUserPayload } from "@/types/graphql";
import { RawURIComponent } from "@/utils/path";
import PaymentSection from "@/app/community/[communityId]/reservation/confirm/components/payment/PaymentSection";
import { CommentTextarea } from "@/app/community/[communityId]/reservation/confirm/components/CommentTextarea";
import { ExpectedPoints } from "@/app/community/[communityId]/reservation/confirm/components/payment/ExpectedPoints";
import { PaymentSummary } from "@/app/community/[communityId]/reservation/confirm/components/payment/PaymentSummary";
import { ActivityDetail, QuestDetail, isActivityCategory, isQuestCategory } from "@/components/domains/opportunities/types";
import { AvailableTicket } from "@/app/community/[communityId]/reservation/confirm/presenters/presentReservationConfirm";

export interface ConfirmPageViewProps {
  user: GqlCurrentUserPayload["user"] | null;
  isAuthenticated: boolean;
  isLoginModalOpen: boolean;
  onLoginModalClose: () => void;
  nextPath: RawURIComponent;
  opportunity: ActivityDetail | QuestDetail;
  startDateTime: Date | null;
  endDateTime: Date | null;
  calculations: {
    feeRequired: number | null;
    pointsRequired: number;
    isActivity: boolean;
    isQuest: boolean;
    maxTickets: number;
    isPointsOnly: boolean;
    totalPointsRequired: number;
    hasInsufficientPoints: boolean;
  };
  participantCount: number;
  onParticipantCountChange: (count: number) => void;
  selectedPointCount: number;
  onPointCountChange: (count: number) => void;
  selectedTicketCount: number;
  onTicketCountChange: (count: number) => void;
  selectedTickets: Record<string, number>;
  onSelectedTicketsChange: (tickets: Record<string, number>) => void;
  useTickets: boolean;
  setUseTickets: (use: boolean) => void;
  usePoints: boolean;
  setUsePoints: (use: boolean) => void;
  ageComment: string | null;
  onAgeCommentChange: (comment: string | null) => void;
  availableTickets: AvailableTicket[];
  userWallet: number | null;
  ticketCounter: {
    count: number;
    increment: () => void;
    decrement: () => void;
  };
  onConfirm: () => Promise<void>;
  validation: {
    isButtonDisabled: boolean;
    disabledReason: string | null;
  };
  creatingReservation: boolean;
}

export default function ConfirmPageView(props: ConfirmPageViewProps) {
  const {
    user,
    isAuthenticated,
    isLoginModalOpen,
    onLoginModalClose,
    nextPath,
    opportunity,
    startDateTime,
    endDateTime,
    calculations,
    participantCount,
    onParticipantCountChange,
    selectedPointCount,
    onPointCountChange,
    selectedTicketCount,
    onTicketCountChange,
    selectedTickets,
    onSelectedTicketsChange,
    useTickets,
    setUseTickets,
    usePoints,
    setUsePoints,
    ageComment,
    onAgeCommentChange,
    availableTickets,
    userWallet,
    ticketCounter,
    onConfirm,
    validation,
    creatingReservation,
  } = props;

  const {
    feeRequired,
    pointsRequired,
    isActivity,
    isQuest,
    maxTickets,
    isPointsOnly,
    hasInsufficientPoints,
  } = calculations;

  const getButtonText = () => {
    if (creatingReservation) return "申込処理中...";
    if (user) return "申し込みをする";
    return "LINEで登録に進む";
  };

  return (
    <main className="min-h-screen">
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={onLoginModalClose}
        nextPath={nextPath}
      />

      <div className="px-6 py-4">
        <NoticeCard
          title="申し込みは未確定です。"
          description="最後までご確認いただき確定させて下さい"
        />
      </div>

      <div className="mx-6 py-4 mt-2 border p-4 rounded-xl">
        <ReservationConfirmationCard
          opportunity={{
            id: opportunity.id,
            title: opportunity.title,
            feeRequired,
            category: opportunity.category,
            communityId: "",
            images: opportunity.images,
            location: opportunity.place?.name ?? "",
            hasReservableTicket: maxTickets > 0,
            pointsRequired,
            slots: [],
          }}
          startDateTime={startDateTime}
          endDateTime={endDateTime}
          category={opportunity.category}
          withShadow={false}
          participantCount={participantCount}
          onChange={onParticipantCountChange}
        />
      </div>

      {!isPointsOnly && <div className="mx-6 border-b border-gray-200 my-6" />}

      {isActivity && (pointsRequired > 0 || maxTickets > 0) && !isPointsOnly && (
        <PaymentSection
          ticketCount={ticketCounter.count}
          onIncrement={ticketCounter.increment}
          onDecrement={ticketCounter.decrement}
          maxTickets={maxTickets}
          availableTickets={availableTickets}
          pricePerPerson={feeRequired}
          participantCount={participantCount}
          useTickets={useTickets}
          setUseTickets={setUseTickets}
          userWallet={userWallet}
          usePoints={usePoints}
          setUsePoints={setUsePoints}
          pointsRequired={pointsRequired}
          onPointCountChange={onPointCountChange}
          onTicketCountChange={onTicketCountChange}
          onSelectedTicketsChange={onSelectedTicketsChange}
        />
      )}

      <div className="border-b border-gray-200 my-6" />

      <div>
        <CommentTextarea
          title="主催者への伝言"
          description="案内人の事前準備が変わる場合があるため、参加者の年齢等の記入にご協力ください"
          placeholder="例）51歳、5歳で参加します"
          value={ageComment}
          onChange={onAgeCommentChange}
        />
      </div>

      <div className="mx-6 border-b border-gray-200 my-6" />

      {isQuest && (
        <>
          <ExpectedPoints
            points={isQuestCategory(opportunity) ? opportunity.pointsToEarn * participantCount : null}
            participantCount={participantCount}
          />
          <div className="border-b border-gray-200 my-6" />
        </>
      )}

      {isActivity && (
        <div className="mx-6">
          <PaymentSummary
            pricePerPerson={isActivityCategory(opportunity) ? feeRequired : null}
            participantCount={participantCount}
            useTickets={useTickets}
            ticketCount={selectedTicketCount}
            usePoints={usePoints}
            pointCount={selectedPointCount}
            pointsRequired={pointsRequired}
            isPointsOnly={isPointsOnly}
          />
          <div className="border-b border-gray-200 my-6" />
        </div>
      )}

      <footer className="max-w-mobile-l w-full flex flex-col items-center px-4 py-4 justify-between mx-auto">
        {isAuthenticated ? (
          <>
            <Button
              size="lg"
              className="mx-auto px-20"
              onClick={onConfirm}
              disabled={validation.isButtonDisabled}
            >
              {getButtonText()}
            </Button>
            {validation.disabledReason && (
              <p className="text-body-sm text-red-500 mt-2">
                {validation.disabledReason}
              </p>
            )}
          </>
        ) : (
          <Button
            size="lg"
            variant="secondary"
            className="mx-auto px-20"
            onClick={onLoginModalClose}
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
  );
}
