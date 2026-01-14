import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const AccessListModal = ({ isOpen, onClose, staff, showingTranslateValue }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-medium text-center pb-6 dark:text-gray-300">
            List of route access for{" "}
            <span className="text-emerald-600">
              {showingTranslateValue(staff?.name)}
            </span>
          </DialogTitle>
        </DialogHeader>
        {staff?.access_list?.length > 0 ? (
          <ol className="list-disc pl-5">
            {staff?.access_list?.map((route, index) => (
              <li
                key={index}
                className="text-sm text-gray-700 dark:text-gray-300 capitalize"
              >
                {route}
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-orange-500 py-10 text-lg text-center">
            This staff not have any route access!
          </p>
        )}
        <DialogFooter className="justify-end">
        <Button
          className="w-full sm:w-auto bg-red-400 text-white hover:bg-red-500"
          variant="destructive"
          onClick={onClose}
        >
          Close
        </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AccessListModal;
