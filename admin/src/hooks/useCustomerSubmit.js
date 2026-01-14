import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";

//internal import
import { SidebarContext } from "@/context/SidebarContext";
import CustomerServices from "@/services/CustomerServices";
import { notifyError, notifySuccess } from "@/utils/toast";
import { useAction } from "@/context/ActionContext";

const useCustomerSubmit = (id) => {
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setIsUpdate } = useContext(SidebarContext);
  const { openDrawer, closeDrawer } = useAction();

  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const customerData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
      };

      if (id) {
        const res = await CustomerServices.updateCustomer(id, customerData);
        setIsUpdate(true);
        notifySuccess(res.message);
        closeDrawer();
        // Invalidate query to trigger refetch
        queryClient.invalidateQueries(["customers"]);
      }
      setIsSubmitting(false);
    } catch (err) {
      notifyError(err?.response?.data?.message || err?.message);
      closeDrawer();
    }
  };

  // Fetch all categories
  const {
    error,
    isFetched,
    data: customer,
    isLoading: loading,
  } = useQuery({
    queryKey: ["customer", id],
    queryFn: () => CustomerServices.getCustomerById(id),
    staleTime: 10 * 60 * 1000, // Cache data for 10 minutes
    gcTime: 15 * 60 * 1000, // Keep data in memory for 15 minutes
    enabled: !!id,
  });

  useEffect(() => {
    if (isFetched && id) {
      setValue("name", customer.name);
      setValue("phone", customer.phone);
      setValue("email", customer.email);
      setValue("address", customer.address);
    }
  }, [id, customer, loading]);

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    setImageUrl,
    imageUrl,
    isSubmitting,
  };
};

export default useCustomerSubmit;
