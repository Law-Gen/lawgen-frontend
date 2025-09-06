import { MotionWrapper } from "@/components/ui/motion-wrapper"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10 flex items-center justify-center p-4">
      <MotionWrapper animation="scaleIn">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <MotionWrapper animation="fadeInUp">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-primary-foreground">⚖️</span>
              </div>
            </MotionWrapper>
            <MotionWrapper animation="fadeInUp" delay={100}>
              <CardTitle className="text-2xl text-primary">Welcome to LegalAid</CardTitle>
            </MotionWrapper>
            <MotionWrapper animation="fadeInUp" delay={200}>
              <p className="text-muted-foreground">Your trusted companion for legal information and assistance</p>
            </MotionWrapper>
          </CardHeader>
          <CardContent className="space-y-6">
            <MotionWrapper animation="fadeInUp" delay={300}>
              <div className="space-y-4">
                <h3 className="font-semibold text-primary">Before we begin:</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Checkbox id="disclaimer" className="mt-1" />
                    <label htmlFor="disclaimer" className="text-sm text-muted-foreground leading-relaxed">
                      I understand that this platform provides general legal information and does not constitute legal
                      advice. For specific legal matters, I should consult with a qualified attorney.
                    </label>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Checkbox id="terms" className="mt-1" />
                    <label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed">
                      I agree to the{" "}
                      <Link href="/terms" className="text-primary hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-primary hover:underline">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>
                </div>
              </div>
            </MotionWrapper>

            <MotionWrapper animation="fadeInUp" delay={400}>
              <div className="space-y-3">
                <Link href="/auth/signin">
                  <Button className="w-full hover:scale-105 transition-transform">Continue to Chat</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button variant="outline" className="w-full hover:scale-105 transition-transform bg-transparent">
                    Create Account
                  </Button>
                </Link>
              </div>
            </MotionWrapper>

            <MotionWrapper animation="fadeInUp" delay={500}>
              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/auth/signin" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </MotionWrapper>
          </CardContent>
        </Card>
      </MotionWrapper>
    </div>
  )
}
