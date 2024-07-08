import { Table, TableBody, TableCell, TableRow } from "../ui/table";
import { TMDProps } from "./type";

export function MDLeaderBoard({ props }: { props: TMDProps }) {

  const sortedLeaders = props.leaders
    ? [...props.leaders].sort((a, b) => b.balance - a.balance)
    : [];

  const uniqueLeaders = sortedLeaders.filter(
    (leader, index, self) =>
      index === self.findIndex((t) => t.userName === leader.userName)
  );

  return (
    <div className="flex justify-center pb-8">
      {/* min-h-[212px] max-h-[504px]  */}
      <div className="w-[96%] rounded-3xl max-h-[414px] bg-backdrop mt-8  overflow-auto ">
        <Table className="flex justify-center  ">
          {/* <TableHeader>
									<TableRow>
										<TableHead className="max-w-full text-center text-normal-stroke">Name</TableHead>
										<TableHead className="max-w-full text-center text-normal-stroke">Honey</TableHead>
									</TableRow>
								</TableHeader> */}
          {uniqueLeaders.length > 0 && (
            <TableBody className="w-[90%] mt-[14px] ">
              {uniqueLeaders.map((leader, idx) => (
                <TableRow
                  key={idx}
                  className="mb-[7px] flex items-center text-[16px] "
                >
                  <div
                    className={`text-[20px] ${idx === 0
                      ? 'text-[gold]'
                      : idx === 1
                        ? 'text-[#cecdcd]'
                        : idx == 2
                          ? 'text-[#ffa041]'
                          : 'text-[white]'
                      } `}
                  >
                    {idx + 1}
                  </div>
                  <TableCell
                    className={`max-w-full text-center mr-auto truncate text-normal-stroke ${idx < 3 && ' text-[20px]'
                      } ${idx === 0
                        ? 'text-[gold]'
                        : idx === 1
                          ? 'text-[#cecdcd]'
                          : idx == 2
                            ? 'text-[#ffa041]'
                            : 'text-[white]'
                      } `}
                  >
                    {leader.userName || 'unidentified'}
                  </TableCell>
                  <TableCell className="ml-[47px] max-w-full text-center text-normal-stroke">
                    {leader.balance.toLocaleString('en')}
                  </TableCell>
                  <span>Honey</span>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </div>
    </div>
  );
}