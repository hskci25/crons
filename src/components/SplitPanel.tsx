const SPEC_STEPS = [
  "Initialize Redis connection pool in the application bootstrapper.",
  "Handle atomic increment operations with a 60-second TTL.",
  "Ensure thread-safety across concurrent requests.",
];

export default function SplitPanel() {
  return (
    <section className="w-full border-y border-outline-variant bg-surface-container-lowest">
      <div className="max-w-container-max mx-auto flex flex-col md:flex-row min-h-[600px]">
        <div className="flex-1 p-12 border-r border-outline-variant">
          <div className="flex items-center gap-2 mb-8">
            <span className="w-2 h-2 bg-primary-container" />
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">
              Technical Specification
            </span>
          </div>
          <h2 className="font-headline-sm text-headline-sm text-on-surface mb-6">
            Task: Implement Distributed Rate Limiter
          </h2>
          <div className="space-y-6 font-body-md text-body-md text-on-surface-variant">
            <p>
              Modify the existing{" "}
              <code className="font-code-md bg-surface-container-high px-1 text-primary">
                /middleware/gatekeeper.go
              </code>{" "}
              to support Redis-backed sliding window rate limiting.
            </p>
            <ul className="list-none space-y-4">
              {SPEC_STEPS.map((step, idx) => (
                <li key={step} className="flex gap-3">
                  <span className="font-code-md text-primary">
                    {String(idx + 1).padStart(2, "0")}.
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex-1 bg-[#0A0A0A] p-0 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-4 py-2 border-b border-[#2A2A2A] bg-[#141414]">
            <span className="font-code-md text-label-sm text-on-surface-variant">
              gatekeeper_test.go
            </span>
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 bg-[#2A2A2A]" />
              <div className="w-2.5 h-2.5 bg-[#2A2A2A]" />
              <div className="w-2.5 h-2.5 bg-[#2A2A2A]" />
            </div>
          </div>
          <div className="p-6 font-code-md text-code-md leading-relaxed overflow-x-auto">
            <pre className="text-[#888]">
              <span className="text-primary">func</span> TestRateLimiter(t
              *testing.T) {"{"}
              {"\n"}    limiter := NewRedisLimiter(redisClient)
              {"\n"}    
              {"\n"}    <span className="text-[#555]">{"/* TODO: Implement test cases for burst handling */"}</span>
              {"\n"}    <span className="text-primary">for</span> i :={" "}
              <span className="text-primary">0</span>; i &lt;{" "}
              <span className="text-primary">100</span>; i++ {"{"}
              {"\n"}        allowed, err := limiter.Allow(
              <span className="text-on-surface-variant">"user_123"</span>)
              {"\n"}        <span className="text-primary">if</span> err != nil{" "}
              {"{"}
              {"\n"}            t.Fatalf(
              <span className="text-on-surface-variant">
                "Unexpected error: %v"
              </span>
              , err)
              {"\n"}        {"}"}
              {"\n"}        <span className="text-primary">if</span> i &gt;={" "}
              <span className="text-primary">60</span> &amp;&amp; allowed {"{"}
              {"\n"}            t.Errorf(
              <span className="text-on-surface-variant">
                "Expected block after 60 requests"
              </span>
              )
              {"\n"}        {"}"}
              {"\n"}    {"}"}
              {"\n"}
              {"}"}
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
