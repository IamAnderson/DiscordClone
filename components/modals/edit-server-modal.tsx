"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { FileUpload } from "../file-upload";
import { Axis3DIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios"
import { useModal } from "../../hooks/use-modal-store";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Server name is required.",
  }),
  imageUrl: z.string().min(1, {
    message: "Server image is required.",
  }),
});


const EditServerModal = () => {

    const { isOpen, onClose, onOpen, type, data } = useModal()
  const router = useRouter();
  const params = useParams();

    const { server } = data;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  });

  useEffect(() => {
    if(server) {
        form.setValue("name", server?.name);
        form.setValue("imageUrl", server?.imageUrl);
    }
  }, [server, form]);

  const isLoading = form.formState.isSubmitting;

  const isModalOpen = isOpen && type === "editServer";

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
        axios.patch(`/api/servers/${params?.serverId}`, values);

        router.refresh();
        onClose();
    } catch (error) {
        console.log(error)
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();    
}

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden   ">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Edit server
          </DialogTitle>

          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <div className="space-y-8">
                  <div className="flex items-center justify-center text-center">
                    <FormField
                      control={form.control}
                      name="imageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <FileUpload 
                            endpoint="serverImage"
                            value={field.value}
                            onChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    ></FormField>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase font-bold text-zinc-500 dark:text-secondary/70">
                        {" "}
                        Server name{" "}
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                          placeholder="Enter server name"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter className="bg-gray-100 px-6 py-4">
                  <Button
                    disabled={isLoading}
                    variant={"primary"}
                    type="submit"
                  >
                    Save
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default EditServerModal;
