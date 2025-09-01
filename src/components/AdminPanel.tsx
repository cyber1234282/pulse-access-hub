import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, Users, Settings, Check, X } from "lucide-react";

interface Profile {
  id: string;
  user_id: string;
  email: string;
  status: string;
  created_at: string;
}

interface AdminSettings {
  id: string;
  telegram_link: string | null;
  whatsapp_number: string | null;
}

export const AdminPanel = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [adminSettings, setAdminSettings] = useState<AdminSettings | null>(null);
  const [telegramLink, setTelegramLink] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchProfiles();
    fetchAdminSettings();
  }, []);

  const fetchProfiles = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    } else {
      setProfiles(data || []);
    }
    setLoading(false);
  };

  const fetchAdminSettings = async () => {
    const { data, error } = await supabase
      .from('admin_settings')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (data) {
      setAdminSettings(data);
      setTelegramLink(data.telegram_link || "");
      setWhatsappNumber(data.whatsapp_number || "");
    }
  };

  const updateUserStatus = async (userId: string, status: 'approved' | 'pending' | 'rejected') => {
    const { error } = await supabase
      .from('profiles')
      .update({ status })
      .eq('user_id', userId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: `User ${status} successfully`,
      });
      fetchProfiles();
    }
  };

  const updateAdminSettings = async () => {
    const settings = {
      telegram_link: telegramLink || null,
      whatsapp_number: whatsappNumber || null,
    };

    if (adminSettings) {
      const { error } = await supabase
        .from('admin_settings')
        .update(settings)
        .eq('id', adminSettings.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update settings",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Settings updated successfully",
        });
      }
    } else {
      const { error } = await supabase
        .from('admin_settings')
        .insert(settings);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to create settings",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Settings created successfully",
        });
        fetchAdminSettings();
      }
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500 text-white">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500 text-white">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-500 text-white">Pending</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-16 h-16 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold cyber-text">ADMIN PANEL</h1>
            <Badge className="cyber-glow">BLACK HACKERS TEAM</Badge>
          </div>
          <Button onClick={handleLogout} variant="outline" className="cyber-button">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="cyber-glow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold cyber-text">{profiles.length}</div>
            </CardContent>
          </Card>

          <Card className="cyber-glow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold cyber-text">
                {profiles.filter(p => p.status === 'pending').length}
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-glow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold cyber-text">
                {profiles.filter(p => p.status === 'approved').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Management */}
        <Card className="cyber-glow">
          <CardHeader>
            <CardTitle className="cyber-text">User Management</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profiles.map((profile) => (
                  <TableRow key={profile.id}>
                    <TableCell className="font-mono">{profile.email}</TableCell>
                    <TableCell>{getStatusBadge(profile.status)}</TableCell>
                    <TableCell>
                      {new Date(profile.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {profile.status !== 'approved' && (
                          <Button
                            size="sm"
                            onClick={() => updateUserStatus(profile.user_id, 'approved')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                        {profile.status !== 'rejected' && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => updateUserStatus(profile.user_id, 'rejected')}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Admin Settings */}
        <Card className="cyber-glow">
          <CardHeader>
            <CardTitle className="cyber-text flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Contact Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="telegram" className="text-accent uppercase tracking-wide">
                Telegram Link
              </Label>
              <Input
                id="telegram"
                value={telegramLink}
                onChange={(e) => setTelegramLink(e.target.value)}
                placeholder="https://t.me/yourusername"
                className="bg-muted border-primary/30 focus:border-primary"
              />
            </div>
            
            <div>
              <Label htmlFor="whatsapp" className="text-accent uppercase tracking-wide">
                WhatsApp Number
              </Label>
              <Input
                id="whatsapp"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="+1234567890"
                className="bg-muted border-primary/30 focus:border-primary"
              />
            </div>

            <Button onClick={updateAdminSettings} className="cyber-button">
              Update Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};