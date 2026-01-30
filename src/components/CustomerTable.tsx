import type { Customer } from "../interface/customer";

interface CustomerTableProps {
  customers: Customer[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onAddClick: () => void;
  onEditClick: (customer: Customer) => void;
  onDeleteClick: (customer: Customer) => void;
}

const CustomerTable = ({
  customers,
  currentPage,
  totalPages,
  onPageChange,
  onAddClick,
  onEditClick,
  onDeleteClick,
}: CustomerTableProps) => {
  return (
    <div className="bg-white/95 backdrop-blur-[10px] p-4 border-[3px] border-[3px] border-[#3f9177] rounded-[10px]">
      <div className="flex justify-between items-center mb-6">
        <div className="text-[25px] text-[#2d3748] tracking-[-0.5px]">
          Customer table
        </div>
        <button
          className="bg-[#3f9177] text-white py-4 px-8 text-base border-none rounded-[10px] cursor-pointer hover:bg-[#37846b]"
          onClick={onAddClick}
        >
          + Customer
        </button>
      </div>

      <table className="w-full border-separate border-spacing-0 overflow-hidden">
        <thead className="bg-gradient-to-br from-[#84cbb3] to-[#548f7c]">
          <tr>
            <th className="p-4 text-left text-white font-bold text-sm uppercase tracking-wider">
              Customer ID
            </th>
            <th className="p-4 text-left text-white font-bold text-sm uppercase tracking-wider">
              Name
            </th>
            <th className="p-4 text-left text-white font-bold text-sm uppercase tracking-wider ">
              Email
            </th>
            <th className="p-4 text-left text-white font-bold text-sm uppercase tracking-wider">
              Phone
            </th>
            <th className="p-4 text-left text-white font-bold text-sm uppercase tracking-wider">
              Company
            </th>
            <th className="p-4 text-left text-white font-bold text-sm uppercase tracking-wider">
              Country
            </th>
             <th className="p-4 text-left text-white font-bold text-sm uppercase tracking-wider">
              Phone 1
            </th>
            <th className="p-4 text-center text-white font-bold text-sm uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer, index) => (
            <tr
              key={customer.id}
              className="transition-all duration-200 ease-in-out odd:bg-[#f7fafc] even:bg-[#edf2f7] hover:bg-[#e6f3ff] hover:scale-[1.01] hover:shadow-[0_4px_12px_rgba(74,92,222,0.2)]"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <td className="p-4 text-[#2d3748] text-sm border-b border-[#cbd5e0]">
                {customer.customerId}
              </td>
              <td className="p-4 text-[#2d3748] text-sm border-b border-[#cbd5e0]">
                {customer.firstName} {customer.lastName}
              </td>
              <td className="p-4 text-[#2d3748] text-sm border-b border-[#cbd5e0]">
                {customer.email}
              </td>
              <td className="p-4 text-[#2d3748] text-sm border-b border-[#cbd5e0]">
                {customer.phone1}
              </td>
              <td className="p-4 text-[#2d3748] text-sm border-b border-[#cbd5e0]">
                {customer.company}
              </td>
              <td className="p-4 text-[#2d3748] text-sm border-b border-[#cbd5e0]">
                {customer.country}
              </td>
              <td className="p-4 text-[#2d3748] text-sm border-b border-[#cbd5e0]">
                {customer.phone1}
              </td>
              <td className="p-4 text-[#2d3748] text-sm border-b border-[#cbd5e0]">
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => onEditClick(customer)}
                    className="p-2 text-[#4a5cde] hover:bg-[#4a5cde] hover:text-white rounded-lg transition-all duration-200"
                    title="Edit customer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDeleteClick(customer)}
                    className="p-2 text-[#e53e3e] hover:bg-[#e53e3e] hover:text-white rounded-lg transition-all duration-200"
                    title="Delete customer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          className="bg-[#3f9177] text-white py-2.5 px-4 border-none rounded-lg cursor-pointer flex items-center gap-2 hover:bg-[#37846b] disabled:bg-[#cbd5e0] disabled:cursor-not-allowed"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          ← Previous
        </button>

        <div className="text-base font-semibold text-[#2d3748]">
          Page {currentPage} of {totalPages}
        </div>

        <button
          className="bg-[#3f9177] text-white py-2.5 px-4 border-none rounded-lg cursor-pointer flex items-center gap-2 hover:bg-[#37846b] disabled:bg-[#cbd5e0] disabled:cursor-not-allowed"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default CustomerTable;
