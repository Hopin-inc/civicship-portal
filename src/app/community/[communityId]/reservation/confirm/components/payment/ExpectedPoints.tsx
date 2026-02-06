interface ExpectedPointsProps {
  points: number | null;
  participantCount: number;
}

const getPointsSharingMessage = (participantCount:number) :string => {
  if(participantCount > 1) {
    return "必要に応じて、一緒に参加する人にポイントを送ってあげてください。";
  } else {
    return "";
  }
}
 

export const ExpectedPoints = ({points, participantCount}: ExpectedPointsProps) => {
  return (
    <div>
        <div className="px-6 flex items-center justify-between">
            <h2 className="text-body-md font-bold">獲得予定ポイント数</h2>
            <p className="text-body-lg font-bold">
            {points?.toLocaleString()}pt
            </p>
        </div>
        <p className="text-body-sm text-caption px-6 mt-2 leading-1.6">参加後、予約者であるあなたのウォレットに上記の{participantCount}人分のポイントが付与されます。<br/>
        {getPointsSharingMessage(participantCount)}</p>
    </div>
  );
};