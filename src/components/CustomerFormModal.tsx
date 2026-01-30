import type { Customer } from "../interface/customer";

interface CustomerFormModalProps {
  isOpen: boolean;
  isEdit: boolean;
  customer?: Customer | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const CustomerFormModal = ({
  isOpen,
  isEdit,
  customer,
  isSubmitting,
  onClose,
  onSubmit,
}: CustomerFormModalProps) => {
  if (!isOpen) return null;

  const title = isEdit ? "Edit Customer" : "Add New Customer";
  const submitText = isEdit
    ? isSubmitting
      ? "Updating..."
      : "Update"
    : isSubmitting
      ? "Submitting..."
      : "Submit";

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.4)] w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky py-2 px-6 top-0 bg-gradient-to-br from-[#4c7f6f] to-[#3f9177]">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl text-white">{title}</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-3xl cursor-pointer"
            >
              ×
            </button>
          </div>
        </div>

        <form onSubmit={onSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-[#2d3748] mb-2">
                Customer ID
              </label>
              <input
                type="text"
                name="customerId"
                pattern="^\S+$"
                title="Customer ID cannot contain spaces"
                defaultValue={customer?.customerId || ""}
                disabled={isEdit}
                placeholder="john123"
                className={`w-full px-4 py-2 border-2 border-[#cbd5e0] rounded-lg focus:outline-none focus:border-[#67a981] transition-colors text-[#2d3748] ${isEdit ? "bg-gray-100" : ""}`}
                required={!isEdit}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#2d3748] mb-2">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                defaultValue={customer?.firstName || ""}
                className="w-full px-4 py-2 border-2 border-[#cbd5e0] rounded-lg focus:outline-none focus:border-[#67a981] transition-colors text-[#2d3748]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#2d3748] mb-2">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                defaultValue={customer?.lastName || ""}
                className="w-full px-4 py-2 border-2 border-[#cbd5e0] rounded-lg focus:outline-none focus:border-[#67a981] transition-colors text-[#2d3748]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#2d3748] mb-2">
                Company
              </label>
              <input
                type="text"
                name="company"
                defaultValue={customer?.company || ""}
                className="w-full px-4 py-2 border-2 border-[#cbd5e0] rounded-lg focus:outline-none focus:border-[#67a981] transition-colors text-[#2d3748]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#2d3748] mb-2">
                City
              </label>
              <input
                type="text"
                name="city"
                defaultValue={customer?.city || ""}
                className="w-full px-4 py-2 border-2 border-[#cbd5e0] rounded-lg focus:outline-none focus:border-[#67a981] transition-colors text-[#2d3748]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#2d3748] mb-2">
                Country
              </label>
              <input
                type="text"
                name="country"
                defaultValue={customer?.country || ""}
                className="w-full px-4 py-2 border-2 border-[#cbd5e0] rounded-lg focus:outline-none focus:border-[#67a981] transition-colors text-[#2d3748]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#2d3748] mb-2">
                Phone 1
              </label>
              <input
                type="tel"
                name="phone1"
                defaultValue={customer?.phone1 || ""}
                className="w-full px-4 py-2 border-2 border-[#cbd5e0] rounded-lg focus:outline-none focus:border-[#67a981] transition-colors text-[#2d3748]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#2d3748] mb-2">
                Phone 2
              </label>
              <input
                type="tel"
                name="phone2"
                defaultValue={customer?.phone2 || ""}
                className="w-full px-4 py-2 border-2 border-[#cbd5e0] rounded-lg focus:outline-none focus:border-[#67a981] transition-colors text-[#2d3748]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#2d3748] mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                defaultValue={customer?.email || ""}
                className="w-full px-4 py-2 border-2 border-[#cbd5e0] rounded-lg focus:outline-none focus:border-[#67a981] transition-colors text-[#2d3748]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#2d3748] mb-2">
                Subscription Date
              </label>
              <input
                type="date"
                name="subscriptionDate"
                defaultValue={
                  customer?.subscriptionDate
                    ? new Date(customer.subscriptionDate)
                        .toISOString()
                        .split("T")[0]
                    : ""
                }
                className="w-full px-4 py-2 border-2 border-[#cbd5e0] rounded-lg focus:outline-none focus:border-[#67a981] transition-colors text-[#2d3748]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-[#2d3748] mb-2">
                Website
              </label>
              <input
                type="url"
                name="website"
                defaultValue={customer?.website || ""}
                className="w-full px-4 py-2 border-2 border-[#cbd5e0] rounded-lg focus:outline-none focus:border-[#67a981] transition-colors text-[#2d3748]"
                placeholder="https://"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-[#2d3748] mb-2">
                About Customer
              </label>
              <textarea
                name="about"
                rows={3}
                maxLength={200}
                defaultValue={customer?.about || ""}
                className="w-full px-4 py-2 border-2 border-[#cbd5e0] rounded-lg focus:outline-none focus:border-[#67a981] transition-colors text-[#2d3748] resize-none"
                placeholder="About customer..."
              ></textarea>
            </div>
          </div>

          <div className="flex gap-4 justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-[#d6dade] text-[#2d3748] py-3 px-6 text-base border-none rounded-[10px] hover:bg-[#a0aec0] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#3f9177] text-white py-3 px-6 text-base border-none rounded-[10px] cursor-pointer hover:bg-[#34846b] disabled:bg-[#a0aec0] disabled:cursor-not-allowed"
            >
              {submitText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerFormModal;
