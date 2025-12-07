import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sprout } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getSession, signIn, signUp } from "@/lib/auth";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    const session = getSession();
    if (session.user) {
      navigate("/home");
    }
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // Login
        const { user, error } = await signIn(username, password);

        if (error) {
          toast({
            title: error.message.includes('username') ? "Mali ang username" : "Hindi makapasok",
            description: error.message,
            variant: "destructive",
          });
        } else if (user) {
          toast({
            title: "Matagumpay!",
            description: "Maligayang pagbabalik!",
          });
          navigate("/home");
        }
      } else {
        // Sign up
        const { user, error } = await signUp(username, password);

        if (error) {
          toast({
            title: error.message.includes('Username ay ginagamit') ? "Username ay ginagamit na" : "Hindi makagawa ng account",
            description: error.message,
            variant: "destructive",
          });
        } else if (user) {
          toast({
            title: "Matagumpay!",
            description: "Maligayang dating sa GreenGrow AR!",
          });
          // Auto-navigate after successful signup
          setTimeout(() => {
            navigate("/home");
          }, 1000);
        }
      }
    } catch (error) {
      toast({
        title: "May problema",
        description: error instanceof Error ? error.message : "Subukan ulit mamaya",
        variant: "destructive",
      });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background p-4 sm:p-6">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <div className="bg-primary/10 p-4 rounded-full">
              <Sprout className="w-12 h-12 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl sm:text-3xl font-bold text-foreground">
            {isLogin ? "Pumasok" : "Magrehistro"}
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            {isLogin
              ? "Magpatuloy sa iyong pagtatanim!"
              : "Gumawa ng bagong account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm sm:text-base">
                Username (Palayaw)
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Ilagay ang iyong username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="h-11 sm:h-12 text-sm sm:text-base"
                minLength={3}
                maxLength={20}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm sm:text-base">
                Password (Susi)
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Ilagay ang iyong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 sm:h-12 text-sm sm:text-base"
                minLength={6}
              />
            </div>
            <Button
              type="submit"
              className="w-full h-11 sm:h-12 text-base sm:text-lg font-semibold"
              disabled={loading}
            >
              {loading
                ? "Sandali..."
                : isLogin
                ? "Pumasok"
                : "Magrehistro"}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:underline text-sm sm:text-base font-medium"
            >
              {isLogin
                ? "Wala pang account? Magrehistro dito"
                : "May account na? Pumasok dito"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;