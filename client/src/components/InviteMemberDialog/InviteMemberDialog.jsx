import { useState } from "react";
import { Mail, UserPlus } from "lucide-react";
import { useSelector } from "react-redux";
import {Dialog,DialogContent,DialogHeader,DialogTitle,DialogDescription,} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {Select,SelectTrigger,SelectValue,SelectContent,SelectItem,} from "@/components/ui/select";
import { useOrganization } from "@clerk/react";
import toast from "react-hot-toast";

const InviteMemberDialog = ({isDialogOpen, setIsDialogOpen}) => {
  const {organization} = useOrganization

  const currentWorkspace = useSelector((state) => state.workspace?.currentWorkspace || null)

  const [isSubmitiing, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({email: "", role: "org:member"});

  const handleSubmit = async(e) => {
   e.preventDefault();
   setIsSubmitting(true)

   try{
     await organization.inviteMember({emailAddress: formData.email, role: formData.role})
     toast.success("Convite enviado com sucesso")
     setIsDialogOpen(false)

   }catch(error){
    console.log(error)
    toast.error(error.response?.data?.message || error.message)
   }finally {
     setIsSubmitting(false)
   }
  }

  return(
   <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
    <DialogContent className='sm:max-w-md'>
     <DialogHeader>
     <DialogTitle className='flex items-center gap-2'>
     <UserPlus className="w-5 h-5"/>
     Invite Team Member
     </DialogTitle>

     {currentWorkspace && (
      <DialogDescription>
       Invite to workspace:{""}
       <span className="font-medium text-primary">
        {currentWorkspace.name}
       </span>
      </DialogDescription>
     )}
     </DialogHeader>

     <form onSubmit={handleSubmit} className="space-y-4">
     <div className="space-y-2">
      <Label>Email Address</Label>

      <div className="relative">
       <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/>
       <Input
        type='email'
        placeholder="Enter email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email:e.target.value})}
        className='pl-9'
        required
       />
      </div>
     </div>

     <div className="space-y-2">
      <Label>Role</Label>

      <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role:value})}>
      <SelectTrigger>
        <SelectValue/>
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="org:member">Member</SelectItem>
        <SelectItem value="org:admin">Admin</SelectItem>
      </SelectContent>
      </Select>
     </div>

      <div className="flex justify-end gap-2 pt-2">
       <Button type='button' variant="outline" onClick={() => setIsDialogOpen(false)}>
        Cancel
       </Button>

       <Button type="submit" disabeld={isSubmitiing || !currentWorkspace}>
        {isSubmitiing ? "Sending..." : "Send Invitation"}
       </Button>
      </div>
     </form>
    </DialogContent>
   </Dialog>
  )
}
export default InviteMemberDialog