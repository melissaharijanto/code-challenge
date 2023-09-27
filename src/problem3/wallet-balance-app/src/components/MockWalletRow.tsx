const MockWalletRow = ({
  amount,
  usdValue,
  formattedAmount,
}: {
  amount: number;
  usdValue: number;
  formattedAmount: string;
}) => {
  return (
    <div>
      <div>{amount}</div>
      <div>{usdValue}</div>
      <div>{formattedAmount}</div>
    </div>
  );
};

export default MockWalletRow;
