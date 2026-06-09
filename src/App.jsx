import { useState, useEffect, useCallback } from "react"
import { supabase } from "./supabase"
import { useAuth } from "./AuthContext"
import AdminDashboard from './pages/AdminDashboard'
import AdminRoute from './components/AdminRoute'

const PAST_GUESTS = `Kunal Shah, Sanjyot Keer, Ashok Ramachandran, Anant Ladha, Nikhil Kamath, Arjun Vaidya, CA Rachana Ranade, Vineeta Singh, Ashneer Grover, Ghazal Alagh, Harsh Mariwala, Anupam Mittal, Ranveer Allahbadia, Ritesh Agarwal, Kaivalya Vohra, Pranjal Kamra, Nithin Kamath, KING, Vishal Gondal, Trishneet Arora, Ankush Sachdeva, Peyush Bansal, Kunal Bahl, Byju Raveendran, Abhijit Iyer-Mitra, Abhishek Bachchan, MC Stan, Yo Yo Honey Singh, Palki Sharma, Armaan Malik, Vikram Sampath, Nitin Gadkari, Shivraj Singh Chouhan, Anil Agarwal, Raghuram Rajan, Zakir Khan, Bhuvan Bam, Namita Thapar, Ananth Narayanan, Pankaj Tripathi, Taapsee Pannu, Sanjana Sanghi, Digital Deepak, Pratham Mittal, Shashank Kumar, Sambhav Jain, Papa CJ, Ayush Jaiswal, Ritesh Malik, Sandeep Jethwani, Finance With Sharan, Srikanth Velamakanni, Harsh Pant, Sahil Bloom, Vandana Shah, Mukesh Bansal, Divya Gokulnath, Rana Daggubati, Ronnie Screwvala, Badshah, Karishma Mehta, Rajnish Kumar, Amit Jain, Sandeep Nailwal, Shantanu Deshpande, Akash Sinha, Deepak Garg, Rajiv Talreja, Anshul Rustaggi, Labour Law Advisor, Raj Das, Sumeet Mehta, Sanjeev Barnwal, NoBroker Founders, Anshuman Singh, Sai Krishna, Zeeshan Sheikh, Ashish Kashyap, Lakshyaraj Singh Mewar, Ex IPS Meeran Chadha Borwankar, Rajpal Yadav, Dinesh Thakkar, C Sivasankaran, Shefali Shah, Prashant Desai, Dr Jaishree Sharad, Col Danvir Singh, The Chainsmokers, Krish Ashok, Kartik Aaryan, Saloni Khanna, Diljit Dosanjh, Ali Fazal, Sunil Chhetri, Vipul Shah, Vicky Kaushal, Sabeer Bhatia, Rajkummar Rao, Tamannaah Bhatia, Praveen Teotia, Navdeep Singh, Kailash Kher, Lalit Modi, Ananya Panday, Arjun Kapoor, Aakash Gupta, Amit Trivedi, MrBeast, Sunidhi Chauhan, Farhan Akhtar, Kangana Ranaut, Baba Ramdev, Shahid Kapoor, Sanjiv Goenka, Martin Garrix, Khan Sir, Hussain Zaidi, Sohum Shah, Nani, Karan Johar, Bill Gates, Ramandeep Singh, Rakul Preet Singh, Aamir Khan, Vijay Mallya, Smriti Irani, Yuzi Chahal, Praggnanandhaa, Bharti Singh, Avadh Ojha, Karan Aujla, Rinku Singh, Shikhar Dhawan, Ishant Sharma, MS Dhoni, Falguni Pathak, Ravi Kishan, Anupam Kher, Abhinav Singh, Saurabh Mukherjea, Boman Irani, Himesh Reshammiya, Deepinder Goyal, Jack Dorsey, Simon Sinek, Michael Phelps, Sunita Williams, Shreya Ghosal, Joe Dispenza, Mark Manson, Lakshya Sen, Saurav Ganguly, Paresh Rawal, Nawazuddin Siddiqui, Jhanvi Kapoor, Ankur Warikoo, Vaibhav Sisinty, Kiara Advani, Ruchir Sharma, Karnal Singh, Col Shivender Kanwar, Dr Tarang Krishna, Lt Gen Shokin Chauhan, Vishal Mishra, Yashashwi Jaiswal, Vikas Divyakirti, Keshav Inani, Ashish Chanchlani, Shiv Shivakumar, Anu Malik, Pawan Sehrawat, Eric Nam, Jackson Wang, Jayant Sinha, Ajai Chowdhry, IAS Abhishek Singh, Srijan Pal Singh, Vivek Atray, Shantanu Gupta, Jayant Mundra, Jason Redman, Chris Williamson, Mokksh Sani, Varun Limaye, Dr. Sweta, Mahendra Singh Dhoni, Vishwa Mohan, Dr. Joe Dispenza`

const CATEGORIES = [
  { id:"all", label:"Daily Mix", color:"#7c3aed" },
  { id:"cricketer", label:"Cricketer", color:"#059669" },
  { id:"politician", label:"Politician", color:"#dc2626" },
  { id:"actor", label:"Actor", color:"#d97706" },
  { id:"actress", label:"Actress", color:"#db2777" },
  { id:"singer", label:"Singer", color:"#7c3aed" },
  { id:"entrepreneur", label:"Entrepreneur", color:"#ca8a04" },
  { id:"startup", label:"Startup Founder", color:"#f97316" },
  { id:"business", label:"Business", color:"#2563eb" },
  { id:"techy", label:"Tech Expert", color:"#6366f1" },
  { id:"finance", label:"Finance/Investor", color:"#10b981" },
  { id:"economist", label:"Economist", color:"#0891b2" },
  { id:"doctor", label:"Doctor/Health", color:"#ef4444" },
  { id:"intellectual", label:"Intellectual/Author", color:"#8b5cf6" },
  { id:"lawyer", label:"Lawyer/Legal", color:"#6b7280" },
  { id:"comedian", label:"Comedian", color:"#f59e0b" },
{ id:"military", label:"Military/Defence", color:"#64748b" },
  { id:"spirituality", label:"Spirituality", color:"#a78bfa" },
  { id:"educator", label:"Educator/IAS", color:"#16a34a" },
  { id:"athlete", label:"Athlete", color:"#ea580c" },
  { id:"international", label:"International", color:"#0ea5e9" },
  { id:"social", label:"Social Media", color:"#ec4899" },
]

const COMPETITORS = [
  { name: "Ranveer Allahbadia", aka: "BeerBiceps", type: "India", edge: "Mass reach + content volume + multi-platform dominance", color: "#f59e0b" },
  { name: "Nikhil Kamath", aka: "WTF Podcast", type: "India", edge: "Elite network + founder/investor credibility", color: "#3b82f6" },
  { name: "Samdish Bhatia", aka: "Unfiltered by Samdish", type: "India", edge: "Deep research + tough questioning", color: "#8b5cf6" },
  { name: "Kamiya Jani", aka: "Curly Tales", type: "India", edge: "Brand collaborations + lifestyle audience", color: "#ec4899" },
  { name: "Sandeep Maheshwari", aka: "Sandeep Maheshwari", type: "India", edge: "Trust + emotional connection with audience", color: "#10b981" },
  { name: "Ankur Warikoo", aka: "Warikoo Podcast", type: "India", edge: "Young professionals audience + career advice niche", color: "#f97316" },
  { name: "Joe Rogan", aka: "JRE", type: "Global", edge: "Global influence + long-form dominance", color: "#ef4444" },
  { name: "Steven Bartlett", aka: "Diary of a CEO", type: "Global", edge: "Storytelling + high production + global branding", color: "#06b6d4" },
  { name: "Lex Fridman", aka: "Lex Fridman Podcast", type: "Global", edge: "Intellectual depth + high-quality conversations", color: "#6366f1" },
  { name: "Jay Shetty", aka: "On Purpose", type: "Global", edge: "Global relatability + personal development", color: "#84cc16" },
]
function App() {
  const { user, logout } = useAuth()
  const [accessStatus, setAccessStatus] = useState(null)
const [accessRole, setAccessRole] = useState(null)
const [preApproveEmail, setPreApproveEmail] = useState("")
const [preApproveRole, setPreApproveRole] = useState("Researcher")
const [pendingRequests, setPendingRequests] = useState([])
const [loadingAccess, setLoadingAccess] = useState(true)
  const [guests, setGuests] = useState([])
  const [categoryGuests, setCategoryGuests] = useState([])
  const [activeCategory, setActiveCategory] = useState("all")
  const [loadingCategory, setLoadingCategory] = useState(false)
  const [loading, setLoading] = useState(false)
  const [replacingIndex, setReplacingIndex] = useState(null)
  const [selectedGuest, setSelectedGuest] = useState(null)
  const [view, setView] = useState("home")
  const [research, setResearch] = useState("")
  const [questions, setQuestions] = useState("")
  const [outreach, setOutreach] = useState({ subject: "", body: "", recipientEmail: "" })
  const [whatsappMsg, setWhatsappMsg] = useState("")
  const [loadingWhatsapp, setLoadingWhatsapp] = useState(false)
  const [apiKey, setApiKey] = useState("")
  const [showApiInput, setShowApiInput] = useState(true)
  const [lastUpdated, setLastUpdated] = useState("")
  const [pipeline, setPipeline] = useState([])
  const [pipelineFilter, setPipelineFilter] = useState("All")
  const [pipelineSort, setPipelineSort] = useState("score")
  const [notes, setNotes] = useState({})
  const [editingNote, setEditingNote] = useState(null)
  const [noteText, setNoteText] = useState("")
  const [copiedEmail, setCopiedEmail] = useState(false)
  const [copiedWA, setCopiedWA] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterPriority, setFilterPriority] = useState("All")
  const [filterStatus, setFilterStatus] = useState("All")
  const [guestHistory, setGuestHistory] = useState([])
  const [historyView, setHistoryView] = useState(false)
  const [titles, setTitles] = useState([])
  const [loadingTitles, setLoadingTitles] = useState(false)
  const [titleGuest, setTitleGuest] = useState(null)
  const [showTitles, setShowTitles] = useState(false)
  const [brief, setBrief] = useState("")
  const [loadingBrief, setLoadingBrief] = useState(false)
  const [showBrief, setShowBrief] = useState(false)
const [briefGuest, setBriefGuest] = useState(null)
  const [intelGuest, setintelGuest] = useState(null)
  const [showIntel, setShowIntel] = useState(false)
  const [intelData, setIntelData] = useState(null)
const [intelLoading, setIntelLoading] = useState(false)
  const [copiedBrief, setCopiedBrief] = useState(false)
  const [alignmentData, setAlignmentData] = useState({})
  const [loadingAlignment, setLoadingAlignment] = useState(null)
  const [globalSearch, setGlobalSearch] = useState("")
  const [globalSearchResult, setGlobalSearchResult] = useState(null)
  const [loadingGlobalSearch, setLoadingGlobalSearch] = useState(false)
  const [plannerMonth, setPlannerMonth] = useState(new Date())
  const [calendarEpisodes, setCalendarEpisodes] = useState([])
const [showAddEpisode, setShowAddEpisode] = useState(false)
const [calendarIntel, setCalendarIntel] = useState(null)
const [loadingCalendarIntel, setLoadingCalendarIntel] = useState(false)
const [newEpisode, setNewEpisode] = useState({ guest: "", topic: "", category: "", recordDate: "", publishDate: "", status: "Booked", priority: "Medium", sponsor: "", owner: "", notes: "" })
  const [comparedGuests, setComparedGuests] = useState([])
  const [trends, setTrends] = useState([])
  const [loadingTrends, setLoadingTrends] = useState(false)
  const [trendGuests, setTrendGuests] = useState({})
  const [loadingTrendGuest, setLoadingTrendGuest] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
  const [youtubeData, setYoutubeData] = useState([])
const [loadingYoutube, setLoadingYoutube] = useState(false)
  const [competitors, setCompetitors] = useState([])
const [loadingCompetitors, setLoadingCompetitors] = useState(false)
const [selectedCompetitors, setSelectedCompetitors] = useState(["Nikhil Kamath", "Ankur Warikoo", "Ranveer Allahbadia"])
const [competitorGaps, setCompetitorGaps] = useState(null)
const [loadingCompetitorGaps, setLoadingCompetitorGaps] = useState(false)
const [selectedCompetitorProfile, setSelectedCompetitorProfile] = useState(null)
  // Content Gap Finder
const [gapCompetitors, setGapCompetitors] = useState([])
const [gapTimeRange, setGapTimeRange] = useState("90")
const [gapGoal, setGapGoal] = useState("views")
const [gapResult, setGapResult] = useState(null)
const [loadingGaps, setLoadingGaps] = useState(false)
const [selectedGap, setSelectedGap] = useState(null)
  const [syncStatus, setSyncStatus] = useState("")
  // Sentiment Analyzer
  const [sentimentGuest, setSentimentGuest] = useState("")
const [sentimentFocus, setSentimentFocus] = useState("Reputation")
const [sentimentTimeRange, setSentimentTimeRange] = useState("30")
const [sentimentRegion, setSentimentRegion] = useState("India")
const [sentimentAudience, setSentimentAudience] = useState("General")
const [sentimentPlatforms, setSentimentPlatforms] = useState(["Twitter", "YouTube", "Reddit", "News"])
const [sentimentResult, setSentimentResult] = useState(null)
const [loadingSentiment, setLoadingSentiment] = useState(false)
  // Availability Predictor
  const [availabilityGuest, setAvailabilityGuest] = useState("")
const [availabilityCategory, setAvailabilityCategory] = useState("Founder")
const [availabilityRegion, setAvailabilityRegion] = useState("India")
const [availabilityPriority, setAvailabilityPriority] = useState("High")
const [availabilityPurpose, setAvailabilityPurpose] = useState("First Episode")
const [availabilityContact, setAvailabilityContact] = useState("First Contact")
const [availabilitySpeed, setAvailabilitySpeed] = useState("Quality")
const [availabilityWarmIntro, setAvailabilityWarmIntro] = useState("No")
const [availabilityContactType, setAvailabilityContactType] = useState("Direct")
const [availabilityResult, setAvailabilityResult] = useState(null)
const [loadingAvailability, setLoadingAvailability] = useState(false)
  // Sponsor Matchmaker
  const [sponsorGuest, setSponsorGuest] = useState("")
  const [sponsorResult, setSponsorResult] = useState(null)
  const [loadingSponsors, setLoadingSponsors] = useState(false)
  const [darkMode, setDarkMode] = useState(true)
// Episode Performance Predictor
const [perfGuest, setPerfGuest] = useState("")
const [perfResult, setPerfResult] = useState(null)
const [perfLoading, setPerfLoading] = useState(false)
// Guest ROI Calculator
const [roiGuest, setRoiGuest] = useState("")
const [roiResult, setRoiResult] = useState(null)
const [roiLoading, setRoiLoading] = useState(false)
// Sponsor Matchmaker V2
const [sponsorGuestType, setSponsorGuestType] = useState("")
const [sponsorTheme, setSponsorTheme] = useState("")
const [sponsorAudience, setSponsorAudience] = useState("")
const [sponsorObjective, setSponsorObjective] = useState("")
const [sponsorBudgetTier, setSponsorBudgetTier] = useState("")
const [sponsorMarket, setSponsorMarket] = useState("")
const [sponsorCustomBrands, setSponsorCustomBrands] = useState("")
const [sponsorExcluded, setSponsorExcluded] = useState([])
const [sponsorSavedToPipeline, setSponsorSavedToPipeline] = useState(false)
// Episode Performance Predictor V2
const [perfGuestType, setPerfGuestType] = useState("")
const [perfEpisodeGoal, setPerfEpisodeGoal] = useState("")
const [perfAudienceSegment, setPerfAudienceSegment] = useState("")
const [perfContentStyle, setPerfContentStyle] = useState("")
const [perfSponsorAngle, setPerfSponsorAngle] = useState("")
const [perfPriorityMetric, setPerfPriorityMetric] = useState("")
const [perfTimeHorizon, setPerfTimeHorizon] = useState("")
const [perfBenchmarkGuest, setPerfBenchmarkGuest] = useState("")
const [userRole, setUserRole] = useState("viewer")
const [teamMembers, setTeamMembers] = useState([])
const [approvalRequests, setApprovalRequests] = useState([])
const [activityLog, setActivityLog] = useState([])
const [pendingCount, setPendingCount] = useState(0)
const [episodeOutcomes, setEpisodeOutcomes] = useState([])
const [outcomesLoading, setOutcomesLoading] = useState(false)
const [outcomeInsights, setOutcomeInsights] = useState(null)
const [showOutcomeForm, setShowOutcomeForm] = useState(false)
const [outcomeForm, setOutcomeForm] = useState({
  guest_name: "", guest_type: "", episode_date: "", episode_title: "",
  predicted_views: "", actual_views: "", watch_time_pct: "", ctr: "",
  retention: "", likes: "", comments: "", shares: "", subscriber_lift: "",
  clip_count: "", clip_views: "", sponsor_value: "", brand_deal: "",
  total_cost: "", outreach_days: "", approval_days: "", notes: ""
})
// Guest ROI Calculator V2
const [roiGuestType, setRoiGuestType] = useState("")
const [roiEpisodeObjective, setRoiEpisodeObjective] = useState("")
const [roiExpectedViews, setRoiExpectedViews] = useState("")
const [roiPublishFrequency, setRoiPublishFrequency] = useState("")
const [roiGuestStatus, setRoiGuestStatus] = useState("")
const [roiSponsorStatus, setRoiSponsorStatus] = useState("")
const [roiClipCount, setRoiClipCount] = useState("")
// ROI Cost Inputs
const [roiCostEditor, setRoiCostEditor] = useState("25000")
const [roiCostClipsEditor, setRoiCostClipsEditor] = useState("10000")
const [roiCostThumbnail, setRoiCostThumbnail] = useState("3000")
const [roiCostStudio, setRoiCostStudio] = useState("5000")
const [roiCostResearch, setRoiCostResearch] = useState("8000")
const [roiCostOutreach, setRoiCostOutreach] = useState("4000")
const [roiCostAppearanceFee, setRoiCostAppearanceFee] = useState("0")
const [roiCostTravel, setRoiCostTravel] = useState("0")
const [roiCostHotel, setRoiCostHotel] = useState("0")
const [roiCostHospitality, setRoiCostHospitality] = useState("0")
const [roiCostTools, setRoiCostTools] = useState("2000")
const [roiCostMisc, setRoiCostMisc] = useState("2000")
// ROI Revenue Inputs
const [roiRevYouTube, setRoiRevYouTube] = useState("")
const [roiRevSponsor, setRoiRevSponsor] = useState("")
const [roiRevBrandDeal, setRoiRevBrandDeal] = useState("")
const [roiRevClips, setRoiRevClips] = useState("")
const [roiRevLongTail, setRoiRevLongTail] = useState("")
const [roiRevBrandLift, setRoiRevBrandLift] = useState("")
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    fetchYouTubeData()
    if (user) { checkAccess(); fetchPendingRequests() }
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
    }, [user])

  const shouldIncludeVaibhav = () => {
    const lastVaibhav = localStorage.getItem("raj_vaibhav_last")
    if (!lastVaibhav) return true
    const diffDays = Math.floor((new Date() - new Date(lastVaibhav)) / (1000 * 60 * 60 * 24))
    return diffDays >= 15
  }

  const checkAccess = async () => {
  if (!user) { setLoadingAccess(false); return }
  const adminEmail = "chaurasiyavikas1234@gmail.com"
  if (user.email === adminEmail) { setAccessStatus("approved"); setAccessRole("Admin"); setLoadingAccess(false); return }
  const { data } = await supabase.from("approval_requests").select("*").eq("email", user.email).single()
  if (data?.status === "approved") { setAccessStatus("approved"); setAccessRole(data.role || "Viewer"); setLoadingAccess(false); return }
  if (data?.status === "rejected") { setAccessStatus("rejected"); setLoadingAccess(false); return }
  if (data?.status === "pending") { setAccessStatus("pending"); setLoadingAccess(false); return }
  const { data: insertData, error: insertError } = await supabase
  .from("approval_requests")
  .upsert({ email: user.email, name: user.user_metadata?.full_name || user.email, avatar_url: user.user_metadata?.avatar_url || "", status: "pending" }, { onConflict: "email" })
console.log("INSERT RESULT:", insertData, "ERROR:", insertError)
const notifyRes = await fetch("/api/notify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: user.email, name: user.user_metadata?.full_name || user.email }) })
console.log("NOTIFY RESULT:", notifyRes.status)
setAccessStatus("pending")
setLoadingAccess(false)
}

const fetchPendingRequests = async () => {
  const { data } = await supabase.from("approval_requests").select("*").order("created_at", { ascending: false })
  if (data) setPendingRequests(data)
}

const handleApproveUser = async (email, role) => {
  await supabase.from("approval_requests").update({ status: "approved", role, updated_at: new Date().toISOString() }).eq("email", email)
  fetchPendingRequests()
}

const handleRemoveUser = async (email) => {
  if (!window.confirm(`Are you sure you want to remove access for ${email}? They will be logged out on next visit.`)) return
  await supabase.from("approval_requests").update({ status: "rejected", updated_at: new Date().toISOString() }).eq("email", email)
  fetchPendingRequests()
}

const handlePreApprove = async () => {
  if (!preApproveEmail) return
  await supabase.from("approval_requests").upsert({ email: preApproveEmail, name: preApproveEmail, status: "approved", role: preApproveRole, updated_at: new Date().toISOString() })
  setPreApproveEmail("")
  fetchPendingRequests()
  alert("✅ Pre-approved: " + preApproveEmail)
}

const callOpenAI = async (prompt, feature = "unknown") => {
    const res = await fetch("/api/openai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, userEmail: user?.email, feature })
    })
    const data = await res.json()
    return data.choices[0].message.content
    
  }
  const fetchYouTubeData = async () => {
  try {
    const res = await fetch("/api/youtube")
    const data = await res.json()
    if (data.items) {
      setYoutubeData(data.items)
    }
  } catch (error) {
    console.error("YouTube fetch error:", error)
  }
}

  const getYouTubeContext = () => {
  if (!youtubeData || youtubeData.length === 0) return ""
  const titles = youtubeData.slice(0, 15).map(v => v.snippet?.title || "").filter(Boolean)
  return "RAJ'S REAL RECENT YOUTUBE EPISODES (" + titles.length + " videos): " + titles.join(" | ")
}

const getYouTubeTopics = () => {
  if (!youtubeData || youtubeData.length === 0) return ""
  return youtubeData.slice(0, 15).map(v => v.snippet?.title || "").filter(Boolean).join(", ")
}
const parseGuests = (text, count) => {
  try {
    const cleaned = text.replace(/```json|```/g, "").trim()
    const parsed = JSON.parse(cleaned)
    const arr = Array.isArray(parsed) ? parsed : [parsed]
    return arr.slice(0, count).map(g => ({
      ...g,
      total: (((g.virality || 7) + (g.relevance || 7) + (g.value || 7)) / 3).toFixed(1),
      priority: (((g.virality || 7) + (g.relevance || 7) + (g.value || 7)) / 3) >= 8 ? "High" : (((g.virality || 7) + (g.relevance || 7) + (g.value || 7)) / 3) >= 6 ? "Medium" : "Low",
      status: "New",
      addedDate: new Date().toLocaleDateString('en-IN')
    }))
  } catch (e) {
    console.error("parseGuests failed:", e, text)
    alert("AI returned an unexpected response. Please try refreshing again.")
    return []
  }
}
  const savePipelineToSupabase = async (pipelineData) => {
    try {
      setSyncStatus("Syncing...")
      await supabase.from('pipeline').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      if (pipelineData.length > 0) {
        await supabase.from('pipeline').insert(pipelineData.map(g => ({
          name: g.name, category: g.category, score: g.total, priority: g.priority,
          status: g.status || 'New', virality: g.virality, relevance: g.relevance, value: g.value,
          why_now: g.whyNow, topic_angle: g.topicAngle, last_appeared: g.lastAppeared,
          recording_date: g.recordingDate || '', added_date: g.addedDate,
          pipeline_date: g.pipelineDate, added_from: g.addedFrom, is_ai_slot: g.isAISlot || false
        })))
      }
      setSyncStatus("Synced ✓")
      setTimeout(() => setSyncStatus(""), 2000)
    } catch (e) { setSyncStatus("Sync failed"); console.error("Supabase pipeline save error:", e) }
  }

  const loadPipelineFromSupabase = async () => {
    try {
      const { data, error } = await supabase.from('pipeline').select('*').order('created_at', { ascending: true })
      if (error) throw error
      if (data && data.length > 0) {
        const mapped = data.map(g => ({
          name: g.name, category: g.category, total: g.score, priority: g.priority,
          status: g.status, virality: g.virality, relevance: g.relevance, value: g.value,
          whyNow: g.why_now, topicAngle: g.topic_angle, lastAppeared: g.last_appeared,
          recordingDate: g.recording_date, addedDate: g.added_date,
          pipelineDate: g.pipeline_date, addedFrom: g.added_from, isAISlot: g.is_ai_slot
        }))
        setPipeline(mapped)
        localStorage.setItem("raj_pipeline", JSON.stringify(mapped))
      } else {
        const saved = localStorage.getItem("raj_pipeline")
        if (saved) { const parsed = JSON.parse(saved); setPipeline(parsed); if (parsed.length > 0) await savePipelineToSupabase(parsed) }
      }
    } catch (e) {
      console.error("Supabase pipeline load error:", e)
      const saved = localStorage.getItem("raj_pipeline")
      if (saved) setPipeline(JSON.parse(saved))
    }
  }

  const saveNotesToSupabase = async (guestName, notesList) => {
    try {
      await supabase.from('notes').delete().eq('guest_name', guestName)
      if (notesList && notesList.length > 0) {
        await supabase.from('notes').insert(notesList.map(n => ({ guest_name: guestName, note_text: n.text, created_at: n.date })))
      }
    } catch (e) { console.error("Supabase notes save error:", e) }
  }

  const loadNotesFromSupabase = async () => {
    try {
      const { data, error } = await supabase.from('notes').select('*')
      if (error) throw error
      if (data && data.length > 0) {
        const notesObj = {}
        data.forEach(n => {
          if (!notesObj[n.guest_name]) notesObj[n.guest_name] = []
          notesObj[n.guest_name].push({ text: n.note_text, date: n.created_at })
        })
        setNotes(notesObj)
        localStorage.setItem("raj_notes", JSON.stringify(notesObj))
      } else {
        const saved = localStorage.getItem("raj_notes")
        if (saved) setNotes(JSON.parse(saved))
      }
    } catch (e) {
      const saved = localStorage.getItem("raj_notes")
      if (saved) setNotes(JSON.parse(saved))
    }
  }

  const saveGuestHistoryToSupabase = async (entry) => {
    try { await supabase.from('guest_history').insert({ session_date: entry.date, guests: entry.guests }) }
    catch (e) { console.error("Supabase history save error:", e) }
  }

  const loadGuestHistoryFromSupabase = async () => {
    try {
      const { data, error } = await supabase.from('guest_history').select('*').order('created_at', { ascending: false }).limit(30)
      if (error) throw error
      if (data && data.length > 0) {
        const history = data.map(h => ({ date: h.session_date, guests: h.guests }))
        setGuestHistory(history)
        localStorage.setItem("raj_guest_history", JSON.stringify(history))
      } else {
        const saved = localStorage.getItem("raj_guest_history")
        if (saved) setGuestHistory(JSON.parse(saved))
      }
    } catch (e) {
      const saved = localStorage.getItem("raj_guest_history")
      if (saved) setGuestHistory(JSON.parse(saved))
    }
  }

  const saveRecentGuestsToSupabase = async (names) => {
    try {
      await supabase.from('recent_guests').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      if (names.length > 0) await supabase.from('recent_guests').insert(names.map(name => ({ name })))
    } catch (e) { console.error("Supabase recent guests save error:", e) }
  }

  const loadRecentGuestsFromSupabase = async () => {
    try {
      const { data, error } = await supabase.from('recent_guests').select('*').order('added_at', { ascending: false }).limit(225)
      if (error) throw error
      if (data && data.length > 0) {
        const names = data.map(g => g.name)
        localStorage.setItem("raj_recent_guests", JSON.stringify(names))
        return names
      } else {
        const saved = localStorage.getItem("raj_recent_guests")
        return saved ? JSON.parse(saved) : []
      }
    } catch (e) {
      const saved = localStorage.getItem("raj_recent_guests")
      return saved ? JSON.parse(saved) : []
    }
  }

  const generateGuests = useCallback(async (keyOverride) => {
    setLoading(true); setView("home"); setActiveCategory("all")
    const recentGuests = await loadRecentGuestsFromSupabase()
    const includeVaibhav = shouldIncludeVaibhav()
    const today = new Date()
    const vaibhavRule = includeVaibhav
      ? `VAIBHAV SISINTY: Include him as AI Tools expert. Topic: Latest AI tools for ${today.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}.`
      : `VAIBHAV SISINTY: Do NOT include him (appeared less than 15 days ago).`
    try {
      const text = await callOpenAI(`${getYouTubeContext() ? "REAL DATA - " + getYouTubeContext() + "\n\nDo NOT suggest guests or topics that overlap with these recent episodes.\n\n" : ""}You are a podcast guest strategist for "Figuring Out With Raj Shamani" - India's top podcast 500+ episodes. Audience: young Indians 18-35.

CORE PHILOSOPHY: Raj Shamani's podcast "Figuring Out" follows a 70/30 booking pattern — 70% exclusive voices (domain experts, insiders, niche specialists) and 30% semi-famous recognizable names (NOT Bollywood A-listers, but niche icons like Avadh Ojha, Vikas Divyakirti, Praggnanandhaa). Find guests with untold stories, insider knowledge, contrarian perspectives, and transformational experiences.

STRICT RULES:
1. NEVER suggest anyone from this PAST GUESTS list who appeared in the last 6-12 months: ${PAST_GUESTS}
2. NEVER suggest anyone who appeared in the last 15 days: ${recentGuests.join(", ")} — ZERO exceptions unless a major national/global emergency directly involves them.
3. NEVER suggest any deceased person. All guests must be confirmed alive today.
4. NEVER suggest mainstream Bollywood A-listers (SRK, Deepika, Ranveer etc), overexposed cricketers (Kohli, Rohit, Bumrah), or politicians overexposed on all podcasts.
5. NEVER suggest anyone with 10M+ Instagram followers who is already on every podcast.
6. Guests who appeared MORE than 1 year ago CAN be suggested again if they have a fresh new story/achievement.

${vaibhavRule}

Suggest EXACTLY 15 guests for ${today.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })} following this EXACT MIX:

DOMESTIC INDIA (12 guests total):
- 3-4 DOMAIN EXPERTS: Deep specialists with untold stories — forensic experts, cancer doctors, AI researchers, stock traders, criminal psychologists, space scientists. People audiences have NEVER heard on a podcast.
- 3-4 INDUSTRY INSIDERS: People with exclusive insider access — ex-military officers, investigative journalists, Amazon/Google business analysts, RBI insiders, intelligence analysts, top lawyers on landmark cases.
- 2-3 NICHE CREATORS tagged [SF]: Semi-famous but NOT overexposed — like Avadh Ojha (geopolitics), Vikas Divyakirti (UPSC), Khan Sir (education), niche sport stars, regional icons with national relevance. Known in their niche (1M-5M followers), NOT mainstream celebrities.
- 1-2 WORLD-CLASS INDIANS tagged [SF]: Recognizable achievers NOT from Bollywood — like Praggnanandhaa (chess), startup founders with $10M+ exit, Olympic medallists, world record holders, IAS toppers with unique stories.

INTERNATIONAL (exactly 3 guests tagged [INTL]):
- Must be world-class: Fortune 500 CEOs, Nobel nominees, NASA/ISRO scientists, UN diplomats, global bestselling authors, Olympic champions.
- Must be based OUTSIDE India (NRIs included if based abroad).
- Must bring a story Indian audiences have NEVER heard on any Indian podcast.

SORTING: Return domestic guests first (Domain Experts → Industry Insiders → [SF] Niche Creators → [SF] World-class Indians), then [INTL] guests last.

Return JSON array EXACTLY 15 items each with: name, category, whyNow, topicAngle, virality(1-10), relevance(1-10), value(1-10), lastAppeared("Never" or year), repeatReason, isAISlot(true only for Vaibhav)
ONLY valid JSON. EXACTLY 15 ITEMS. NO MARKDOWN.      
      const withScores = parseGuests(text, 15).sort((a, b) => {
  const aIntl = a.name.includes('[INTL]') ? 1 : 0
  const bIntl = b.name.includes('[INTL]') ? 1 : 0
  return aIntl - bIntl
})
      if (includeVaibhav) localStorage.setItem("raj_vaibhav_last", new Date().toISOString())
      const newRecentGuests = [...withScores.map(g => g.name), ...recentGuests].slice(0, 225)
      localStorage.setItem("raj_recent_guests", JSON.stringify(newRecentGuests))
      await saveRecentGuestsToSupabase(newRecentGuests)
      const now = new Date().toLocaleString('en-IN')
      setGuests(withScores); setLastUpdated(now)
      const historyEntry = { date: now, guests: withScores.map(g => ({ name: g.name, category: g.category, total: g.total, priority: g.priority })) }
      await saveGuestHistoryToSupabase(historyEntry)
      await loadGuestHistoryFromSupabase()
      localStorage.setItem("raj_guests", JSON.stringify(withScores))
      localStorage.setItem("raj_last_updated", now)
      localStorage.setItem("raj_last_date", new Date().toLocaleDateString('en-IN'))
    } catch (e) { alert("Error: " + e.message) }
    setLoading(false)
  }, [])

  const generateCategoryGuests = async (cat) => {
    if (!apiKey) { alert("Please enter your OpenAI API key first!"); return }
    if (cat.id === "all") { setActiveCategory("all"); setCategoryGuests([]); return }
    setActiveCategory(cat.id); setLoadingCategory(true); setCategoryGuests([])
    const allNames = [...guests, ...pipeline].map(g => g.name).join(", ")
    const recentGuests = await loadRecentGuestsFromSupabase()
    try {
      const text = await callOpenAI(`Podcast guest strategist for "Figuring Out With Raj Shamani".
      CORE PHILOSOPHY: Raj Shamani's podcast follows a 70/30 pattern — 70% exclusive voices (domain experts, insiders, niche specialists) and 30% semi-famous recognizable names (NOT Bollywood A-listers, but niche icons like Avadh Ojha, Vikas Divyakirti, Praggnanandhaa). Find guests with untold stories, insider knowledge, and transformational experiences.
Category: ${cat.label}. 
STRICTLY Avoid (past guests): ${PAST_GUESTS}
${getYouTubeContext() ? "REAL DATA - " + getYouTubeContext() + "\nAvoid suggesting guests or topics that overlap with these recent episodes." : ""}
STRICTLY Avoid (shown recently): ${recentGuests.join(", ")}, ${allNames}
NEVER suggest deceased people. All guests must be alive.
Suggest EXACTLY 5 best exclusive ${cat.label} voices for ${new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}.
Return EXACTLY 5 items JSON array each with: name, category, whyNow, topicAngle, virality(1-10), relevance(1-10), value(1-10), lastAppeared("Never" or year), repeatReason, isAISlot(false)
ONLY valid JSON. EXACTLY 5 ITEMS. NO MARKDOWN.`)
      setCategoryGuests(parseGuests(text, 5))
    } catch (e) { alert("Error: " + e.message) }
    setLoadingCategory(false)
  }

  const fetchTrends = async () => {
    setLoadingTrends(true); setTrends([]); setTrendGuests({})
    try {
      const text = await callOpenAI(`You are a trend intelligence analyst for Raj Shamani's podcast "Figuring Out". Today is ${new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.
      ${getYouTubeContext() ? "REAL DATA - " + getYouTubeContext() + "\nDo NOT suggest trends Raj already covered. Find fresh angles only.\n" : ""}
  
  Identify 12 high-value trending topics RIGHT NOW — 8 from India, 4 International.
  
  Categories: Business/Startups, Tech/AI, Culture/Society, Creator Economy, Macro/Policy, Seasonal, Controversial, Evergreen Opportunity.
  
  Return ONLY valid JSON array of 12 items:
  [{
    "topic": "specific trend title",
    "headline": "1 specific real headline driving this trend",
    "category": "Business|Tech|Culture|Creator|Macro|Seasonal|Controversial|Evergreen",
    "scope": "India|International",
    "heat": 1-10,
    "momentumDirection": "Rising|Stable|Declining",
    "longevity": "Temporary|Durable|Evergreen",
    "audienceRelevance": 1-10,
    "opportunityScore": 1-10,
    "firstMoverAlert": true|false,
    "saturationWarning": "Low|Medium|High",
    "peakWindow": "Act Now|2-4 Weeks|Low Urgency",
    "suggestedGuest": "specific real person name",
    "guestFitReason": "why this guest owns this trend",
    "episodeAngle": "specific episode angle for Raj",
    "sponsorFit": "sponsor category that fits",
    "hook": "compelling opening hook for the episode",
    "riskLevel": "Low|Medium|High",
    "platformSources": ["platform1", "platform2"]
  }]
  ONLY valid JSON. NO MARKDOWN.`, "trending_topics")
      const cleaned = text.replace(/```json|```/g, "").trim()
      setTrends(JSON.parse(cleaned))
    } catch (e) { alert("Error fetching trends: " + e.message) }
    setLoadingTrends(false)
  }
  const findGuestForTrend = async (trend) => {
    if (!apiKey) return
    setLoadingTrendGuest(trend.topic)
    try {
      const text = await callOpenAI(`Trending topic: "${trend.topic}" — ${trend.headline} [${trend.scope}]
Which ONE exclusive podcast guest would be PERFECT for "Figuring Out With Raj Shamani"?
PHILOSOPHY: NOT a famous celebrity. Find the domain expert, the insider, the person with the real story — someone audiences haven't heard yet.
${getYouTubeContext() ? "REAL DATA - " + getYouTubeContext() + "\nDo not suggest anyone already featured in these episodes." : ""}
Must NOT be from past guests: ${PAST_GUESTS}
Must be alive. Must be a real person with real expertise on this exact topic.
Return ONLY valid JSON: { "name": "", "category": "", "whyNow": "", "topicAngle": "", "virality": 1-10, "relevance": 1-10, "value": 1-10, "lastAppeared": "Never", "repeatReason": "", "isAISlot": false }
ONLY valid JSON. NO MARKDOWN.`)
      const cleaned = text.replace(/```json|```/g, "").trim()
      const parsed = JSON.parse(cleaned)
      const guest = { ...parsed, total: ((parsed.virality + parsed.relevance + parsed.value) / 3).toFixed(1), priority: ((parsed.virality + parsed.relevance + parsed.value) / 3) >= 8 ? "High" : ((parsed.virality + parsed.relevance + parsed.value) / 3) >= 6 ? "Medium" : "Low", status: "New", addedDate: new Date().toLocaleDateString('en-IN') }
      setTrendGuests(prev => ({ ...prev, [trend.topic]: guest }))
    } catch (e) { alert("Error: " + e.message) }
    setLoadingTrendGuest(null)
  }

  const fetchCompetitors = async () => {
    setLoadingCompetitors(true); setCompetitors([])
    try {
      const text = await callOpenAI("" + (getYouTubeContext() ? "REAL DATA - " + getYouTubeContext() + " Use this to understand what topics Raj already covers when finding gaps. " : "") + "You are a competitive intelligence analyst for Raj Shamani's podcast. Analyze these 6 competitors: Nikhil Kamath, Ankur Warikoo, Ranveer Allahbadia, Sharan Hegde, Prakhar Ke Pravachan, Think School. Return ONLY valid JSON array of 6 objects with these fields: host, positioning, audienceType, momentumScore (1-10), momentumTrend (Rising/Stable/Declining), contentPillars (array of 3), mainFormats (array of 2), guestDiversity, sponsorThemes (array of 2), recentGuests (array of 3 with name/category/performance), betterThanRaj, weakerThanRaj, topicGaps (array of 2), guestGaps (array of 2). NO MARKDOWN.", "competitor_intel")
      const cleaned = text.replace(/```json|```/g, "").trim()
      setCompetitors(JSON.parse(cleaned))
    } catch (e) { alert("Error: " + e.message) }
    setLoadingCompetitors(false)
  }
  
  const analyzeCompetitorGaps = async () => {
    if (!competitors.length) { alert("Please load competitors first!"); return }
    setLoadingCompetitorGaps(true); setCompetitorGaps(null)
    try {
      const selected = competitors.filter(c => selectedCompetitors.includes(c.host))
      const text = await callOpenAI(`You are a competitive strategy analyst for Raj Shamani's podcast.
  Based on these competitor profiles: ${JSON.stringify(selected.map(c => ({ host: c.host, contentPillars: c.contentPillars, topicGaps: c.topicGaps, guestGaps: c.guestGaps })))}
  ${getYouTubeContext() ? "REAL DATA - " + getYouTubeContext() + "\nRaj already covered these topics — only suggest gaps he has NOT covered yet." : ""}
  
  Find the top 8 gaps Raj should fill. Return ONLY valid JSON array:
  [{
    "gapTitle": "specific gap title",
    "gapType": "Topic|Guest|Format|Trend|Sponsor|Region",
    "urgencyScore": 1-10,
    "competitorsWinning": ["competitor names"],
    "whyItMatters": "1-2 lines",
    "suggestedGuest": "specific real person",
    "guestCategory": "category",
    "episodeAngle": "specific angle",
    "sponsorFit": "sponsor category",
    "audienceFit": "why Raj's audience would love this",
    "riskWarning": "any risk or null"
  }]
  ONLY valid JSON. NO MARKDOWN.`, "competitor_gaps")
      const cleaned = text.replace(/```json|```/g, "").trim()
      setCompetitorGaps(JSON.parse(cleaned))
    } catch (e) { alert("Error: " + e.message) }
    setLoadingCompetitorGaps(false)
  }

  const generateCalendarIntelligence = async () => {
    if (!calendarEpisodes.length) { alert("Please add some episodes first!"); return }
    setLoadingCalendarIntel(true); setCalendarIntel(null)
    try {
      const text = await callOpenAI(`You are an editorial strategy analyst for Raj Shamani's podcast "Figuring Out".
  Here are the planned episodes: ${JSON.stringify(calendarEpisodes.map(e => ({ guest: e.guest, topic: e.topic, category: e.category, publishDate: e.publishDate, status: e.status, priority: e.priority })))}
  ${getYouTubeContext() ? "REAL DATA - " + getYouTubeContext() + "\nUse this real data to assess topic overlap, pacing, and content diversity." : ""}
  
  Analyze this content calendar and return ONLY valid JSON:
  {
    "contentMixScore": 0-100,
    "topicDiversityScore": 0-100,
    "guestPacingScore": 0-100,
    "sponsorAlignmentScore": 0-100,
    "overallHealthScore": 0-100,
    "alerts": [{"type": "warning|danger|success", "message": "alert message"}],
    "bestPublishSequence": ["episode order recommendation 1", "episode order recommendation 2", "episode order recommendation 3"],
    "growthOpportunities": ["opportunity 1", "opportunity 2", "opportunity 3"],
    "topicBalanceReport": "2-3 lines on topic balance",
    "guestMixReport": "2-3 lines on guest diversity",
    "conflictWarnings": ["any scheduling conflicts or empty slot warnings"],
    "monthlyRecommendation": "3-4 lines strategic recommendation for this month"
  }
  ONLY valid JSON. NO MARKDOWN.`, "calendar_intel")
      const cleaned = text.replace(/```json|```/g, "").trim()
      setCalendarIntel(JSON.parse(cleaned))
    } catch (e) { alert("Error: " + e.message) }
    setLoadingCalendarIntel(false)
  }
  const generateGapAnalysis = async () => {
    if (!gapCompetitors.length) { alert("Please select at least one competitor!"); return }
    setLoadingGaps(true)
    setGapResult(null)
    setSelectedGap(null)
    try {
      const text = await callOpenAI(`You are a podcast growth intelligence analyst for Raj Shamani's podcast "Figuring Out".
  Selected competitors: ${gapCompetitors.join(", ")}
  Time range: Last ${gapTimeRange} days
  Growth goal: ${gapGoal}
  Raj's podcast focus: Business, entrepreneurship, mindset, exclusive voices, India growth stories.
  ${getYouTubeContext() ? "REAL DATA - " + getYouTubeContext() + "\nThese are Raj's ACTUAL recent episodes. Only suggest gaps he has NOT covered." : ""}
  
  Analyze these competitors and find content gaps Raj should fill. Return ONLY valid JSON array of 8 gaps:
  [{
    "title": "gap title",
    "type": "Topic|Guest|Format|Audience|Monetization|Seasonal",
    "priority": "High|Medium|Low",
    "priorityScore": 1-10,
    "whyCompetitorsWinning": "explanation",
    "rajCoverageStatus": "Never Covered|Rarely Covered|Covered Once",
    "estimatedUpside": "e.g. 2-5M views potential",
    "suggestedGuest": "specific real person name",
    "guestFitReason": "why this guest fits",
    "episodeAngle": "specific episode angle",
    "sponsorTieIn": "relevant sponsor category",
    "competitorMomentum": "High|Medium|Low",
    "evidence": "specific competitor episode or topic example"
  }]
  ONLY valid JSON. NO MARKDOWN.`)
      const cleaned = text.replace(/```json|```/g, "").trim()
      const parsed = JSON.parse(cleaned)
      setGapResult(parsed)
    } catch (e) { alert("Error: " + e.message) }
    setLoadingGaps(false)
  }

  // ─── SENTIMENT ANALYZER ───────────────────────────────────────────────────
  const analyzeSentiment = async () => {
    if (!sentimentGuest.trim()) { alert("Please enter a guest name!"); return }
    setLoadingSentiment(true); setSentimentResult(null)
    try {
      const text = await callOpenAI(`You are a reputation intelligence analyst for Raj Shamani's podcast "Figuring Out".
  Guest: ${sentimentGuest}
  ${getYouTubeContext() ? "REAL DATA - " + getYouTubeContext() + "\nIf this guest appeared in any of these episodes, factor in actual audience reception." : ""}
  Analysis Focus: ${sentimentFocus}
  Time Range: Last ${sentimentTimeRange} days
  Region: ${sentimentRegion}
  Audience Type: ${sentimentAudience}
  Platforms: ${sentimentPlatforms.join(", ")}
  
  Return ONLY valid JSON:
  {
    "name": "",
    "reputationScore": 0-100,
    "audienceLoveScore": 0-100,
    "brandSafetyScore": 0-100,
    "audienceTrustScore": 0-100,
    "controversyIntensity": 0-100,
    "trendDirection": "Rising|Stable|Declining",
    "trendReason": "1 line why",
    "overallVerdict": "Safe|Caution|Risky",
    "platforms": [
      { "name": "Twitter", "positive": 0-100, "negative": 0-100, "neutral": 0-100, "summary": "1 line" },
      { "name": "YouTube", "positive": 0-100, "negative": 0-100, "neutral": 0-100, "summary": "1 line" },
      { "name": "Reddit", "positive": 0-100, "negative": 0-100, "neutral": 0-100, "summary": "1 line" },
      { "name": "News", "positive": 0-100, "negative": 0-100, "neutral": 0-100, "summary": "1 line" }
    ],
    "topPraiseThemes": ["theme 1", "theme 2", "theme 3"],
    "topCriticismThemes": ["theme 1", "theme 2", "theme 3"],
    "redFlags": ["red flag 1", "red flag 2"],
    "greenOpportunities": ["opportunity 1", "opportunity 2"],
    "backlashProbability": "Low|Medium|High",
    "backlashTriggers": ["trigger 1", "trigger 2"],
    "crisisIndicator": "None|Watch|Alert",
    "sponsorSafetyNote": "1-2 lines for sponsors",
    "suggestedInterviewAngle": "specific angle that maximizes positive reception",
    "riskMitigation": "what Raj should do to reduce risk if booking",
    "bestFraming": "how to frame this guest to Raj's audience",
    "audienceSegments": [
      { "segment": "segment name", "sentiment": "Positive|Neutral|Negative", "reason": "why" },
      { "segment": "segment name", "sentiment": "Positive|Neutral|Negative", "reason": "why" }
    ],
    "rajRecommendation": "BOOK NOW|BOOK WITH CAUTION|WAIT|AVOID",
    "rajRecommendationReason": "2-3 line specific reason for Raj's show"
  }
  ONLY valid JSON. NO MARKDOWN.`, "sentiment_analyzer")
      const cleaned = text.replace(/```json|```/g, "").trim()
      setSentimentResult(JSON.parse(cleaned))
    } catch (e) { alert("Error: " + e.message) }
    setLoadingSentiment(false)
  }
  // ─── AVAILABILITY PREDICTOR ──────
  const predictAvailability = async () => {
  if (!availabilityGuest.trim()) { alert("Please enter a guest name!"); return }
  setLoadingAvailability(true); setAvailabilityResult(null)
  try {
    const text = await callOpenAI(`You are an enterprise podcast booking strategist for Raj Shamani's "Figuring Out".
Guest: ${availabilityGuest}
${getYouTubeContext() ? "REAL DATA - " + getYouTubeContext() + "\nIf this guest type appeared recently, factor that into availability advice." : ""}
Category: ${availabilityCategory}
Region/Timezone: ${availabilityRegion}
Priority: ${availabilityPriority}
Purpose: ${availabilityPurpose}
Contact Stage: ${availabilityContact}
Booking Speed: ${availabilitySpeed}
Warm Intro Available: ${availabilityWarmIntro}
Preferred Contact Type: ${availabilityContactType}

Return ONLY valid JSON:
{
  "bookingProbability": 0-100,
  "bookingProbabilityLabel": "Very High / High / Moderate / Low / Very Low",
  "confidenceBand": "e.g. 65-80%",
  "bestMonth": "e.g. August-September",
  "bestWeek": "e.g. First or second week",
  "bestDay": "e.g. Tuesday or Wednesday",
  "bestTime": "e.g. 10am-12pm IST",
  "timezone": "e.g. IST / EST",
  "channels": [
    { "name": "Email", "responseRate": 0-100, "notes": "why" },
    { "name": "WhatsApp", "responseRate": 0-100, "notes": "why" },
    { "name": "Instagram DM", "responseRate": 0-100, "notes": "why" },
    { "name": "LinkedIn", "responseRate": 0-100, "notes": "why" }
  ],
  "bestChannel": "single best channel name",
  "contactPerson": "e.g. Manager / PR Agency / Direct / Assistant",
  "warmIntroAdvantage": "how much warm intro helps in this case",
  "objections": [
    { "objection": "likely objection", "handle": "how to handle it" },
    { "objection": "likely objection", "handle": "how to handle it" },
    { "objection": "likely objection", "handle": "how to handle it" }
  ],
  "messageAngle": "what to lead with in outreach message",
  "messageAvoid": "what to avoid saying",
  "followUpSequence": [
    { "day": "Day 1", "action": "specific action", "channel": "channel name" },
    { "day": "Day 4", "action": "specific action", "channel": "channel name" },
    { "day": "Day 10", "action": "specific action", "channel": "channel name" },
    { "day": "Day 21", "action": "specific action", "channel": "channel name" }
  ],
  "bestPathToYes": "single most strategic recommendation",
  "contactabilityScore": 0-10,
  "responsivenessScore": 0-10,
  "schedulingEaseScore": 0-10,
  "reputationBarrier": 0-10,
  "relevanceScore": 0-10,
  "confidenceExplanation": "2-3 lines explaining why this prediction"
}
ONLY valid JSON. NO MARKDOWN.`, "availability_predictor")
    const cleaned = text.replace(/```json|```/g, "").trim()
    setAvailabilityResult(JSON.parse(cleaned))
  } catch (e) { alert("Error: " + e.message) }
  setLoadingAvailability(false)
}
// — EPISODE PERFORMANCE PREDICTOR —
const predictPerformance = async () => {
  if (!perfGuest.trim()) { alert("Please enter a guest name!"); return }
  if (!perfGuestType) { alert("Please select guest type!"); return }
  if (!perfEpisodeGoal) { alert("Please select episode goal!"); return }
  if (!perfAudienceSegment) { alert("Please select audience segment!"); return }
  if (!perfContentStyle) { alert("Please select content style!"); return }
  if (!perfTimeHorizon) { alert("Please select time horizon!"); return }
  setPerfLoading(true); setPerfResult(null)
  try {
    const benchmarkNote = perfBenchmarkGuest.trim()
      ? `Benchmark against this past episode guest: ${perfBenchmarkGuest}.`
      : "Benchmark against Raj Shamani's top 5 performing episodes."
    const text = await callOpenAI(`You are a senior YouTube podcast performance strategist for "Figuring Out" by Raj Shamani. Raj's channel averages 2-5M views per episode. Audience is Indian, 18-35, entrepreneurship/finance/lifestyle focused.
      ${getYouTubeContext() ? "REAL DATA - " + getYouTubeContext() + "\nUse these actual recent episodes as benchmarks. Base view predictions on real patterns." : ""}

EPISODE CONTEXT:
- Guest: ${perfGuest}
- Guest Type: ${perfGuestType}
- Episode Goal: ${perfEpisodeGoal}
- Audience Segment: ${perfAudienceSegment}
- Content Style: ${perfContentStyle}
- Sponsor Angle: ${perfSponsorAngle || "Not specified"}
- Priority Metric: ${perfPriorityMetric || "Overall performance"}
- Time Horizon: ${perfTimeHorizon}
- ${benchmarkNote}

IMPORTANT: Every score must be unique and context-driven based on the guest and inputs above. Do NOT give generic scores. Reason each score specifically.

Return ONLY valid JSON, NO markdown:
{
  "guestName": "",
  "episodeContext": "2 line summary of this specific episode opportunity",
  "viewsForecast": {
    "low": "e.g. 800K",
    "mid": "e.g. 1.8M",
    "high": "e.g. 3.2M",
    "reasoning": "2 line specific reason based on guest type and theme"
  },
  "confidenceRange": {
    "low": "e.g. 68%",
    "high": "e.g. 84%",
    "driver": "1 line on what drives confidence up or down"
  },
  "metrics": {
    "engagementRate": {"score": "e.g. 8.2%", "reason": "1 line"},
    "avgWatchTime": {"score": "e.g. 14 mins", "reason": "1 line"},
    "shareabilityScore": {"score": "7.5/10", "reason": "1 line"},
    "brandSafetyScore": {"score": "9/10", "reason": "1 line"},
    "sponsorAttractiveness": {"score": "8/10", "reason": "1 line"},
    "viralClipPotential": {"score": "High/Medium/Low", "reason": "1 line"},
    "topicFreshnessScore": {"score": "7/10", "reason": "1 line"},
    "creatorFitScore": {"score": "8.5/10", "reason": "1 line"},
    "audienceRetentionRisk": {"score": "Low/Medium/High", "reason": "1 line"},
    "guestNoveltyScore": {"score": "8/10", "reason": "1 line"}
  },
  "revenueEstimate": {
    "youtubeAds": "e.g. ₹1.2-2.4L",
    "sponsorDeal": "e.g. ₹5-12L",
    "totalEstimate": "e.g. ₹6-15L",
    "reasoning": "1 line"
  },
  "comparableEpisodes": [
    {"guest": "", "views": "", "similarity": "1 line why similar"}
  ],
  "improvementActions": [
    "Specific action 1 before recording",
    "Specific action 2 for thumbnail/title",
    "Specific action 3 for distribution"
  ],
  "publishStrategy": {
    "bestDay": "e.g. Tuesday or Wednesday",
    "bestTime": "e.g. 11AM IST",
    "reasoning": "1 line"
  },
  "topReasons": ["reason1", "reason2", "reason3"],
  "riskFactors": ["risk1", "risk2"],
  "finalVerdict": "PUBLISH NOW / REVISE FIRST / HOLD / STRONG YES",
  "verdictReason": "2 line specific reasoning for the verdict"
}

ONLY valid JSON. NO MARKDOWN.`, "performance_predictor")
    const cleaned = text.replace(/```json|```/g, "").trim()
    setPerfResult(JSON.parse(cleaned))
  } catch (e) { alert("Error: " + e.message) }
  setPerfLoading(false)
}
// — GUEST ROI CALCULATOR —
const calculateROI = async () => {
  if (!roiGuest.trim()) { alert("Please enter a guest name!"); return }
  if (!roiGuestType) { alert("Please select guest type!"); return }
  if (!roiEpisodeObjective) { alert("Please select episode objective!"); return }
  if (!roiExpectedViews) { alert("Please select expected views!"); return }
  setRoiLoading(true); setRoiResult(null)
  try {
    const totalCosts = [
      Number(roiCostEditor), Number(roiCostClipsEditor), Number(roiCostThumbnail),
      Number(roiCostStudio), Number(roiCostResearch), Number(roiCostOutreach),
      Number(roiCostAppearanceFee), Number(roiCostTravel), Number(roiCostHotel),
      Number(roiCostHospitality), Number(roiCostTools), Number(roiCostMisc)
    ].reduce((a, b) => a + b, 0)

    const userRevInputs = [
      roiRevYouTube, roiRevSponsor, roiRevBrandDeal,
      roiRevClips, roiRevLongTail, roiRevBrandLift
    ].filter(v => v.trim()).map(v => Number(v)).reduce((a, b) => a + b, 0)

    const text = await callOpenAI(`You are a senior podcast business strategist for "Figuring Out" by Raj Shamani.

${getYouTubeContext() ? "REAL DATA - " + getYouTubeContext() + "\nUse these actual episodes to calibrate revenue estimates based on real patterns." : ""}
      EPISODE INPUTS:
- Guest: ${roiGuest}
- Guest Type: ${roiGuestType}
- Episode Objective: ${roiEpisodeObjective}
- Expected Views Range: ${roiExpectedViews}
- Publishing Frequency: ${roiPublishFrequency || "Not specified"}
- Guest Status: ${roiGuestStatus || "Not specified"}
- Sponsor Status: ${roiSponsorStatus || "Not specified"}
- Clip Output Count: ${roiClipCount || "Not specified"}

COST INPUTS (user-entered, in INR):
- Editor: ₹${roiCostEditor}
- Clips Editor: ₹${roiCostClipsEditor}
- Thumbnail: ₹${roiCostThumbnail}
- Studio: ₹${roiCostStudio}
- Research: ₹${roiCostResearch}
- Outreach: ₹${roiCostOutreach}
- Guest Appearance Fee: ₹${roiCostAppearanceFee}
- Guest Travel: ₹${roiCostTravel}
- Guest Hotel: ₹${roiCostHotel}
- Hospitality: ₹${roiCostHospitality}
- Tools/Software: ₹${roiCostTools}
- Misc: ₹${roiCostMisc}
- TOTAL COSTS: ₹${totalCosts.toLocaleString()}

REVENUE INPUTS (user-entered, 0 means not specified):
- YouTube Ads: ₹${roiRevYouTube || "estimate based on views"}
- Sponsor Deal: ₹${roiRevSponsor || "estimate based on guest type"}
- Brand Deal: ₹${roiRevBrandDeal || "estimate"}
- Clips Revenue: ₹${roiRevClips || "estimate"}
- Long-tail Archive: ₹${roiRevLongTail || "estimate"}
- Brand Lift Value: ₹${roiRevBrandLift || "estimate"}
- USER TOTAL REVENUE: ₹${userRevInputs > 0 ? userRevInputs.toLocaleString() : "not entered, please estimate"}

INSTRUCTIONS:
- Use user-entered costs exactly as provided
- For revenue: use user values if entered, otherwise estimate realistically based on ${roiExpectedViews} views and ${roiGuestType}
- Generate LOW / BASE / HIGH scenarios
- Be realistic, not inflated. Cap ROI at believable levels
- Show payback period in months
- Show sensitivity: what happens if views drop 50%

Return ONLY valid JSON, NO markdown:
{
  "guestName": "",
  "episodeSummary": "2 line summary",
  "totalCosts": ${totalCosts},
  "costBreakdown": {
    "production": "₹X",
    "research": "₹X",
    "guestAcquisition": "₹X",
    "sales": "₹X",
    "ops": "₹X"
  },
  "scenarios": {
    "low": {
      "totalRevenue": "₹X",
      "netROI": "₹X",
      "roiPercentage": "X%",
      "confidence": "X%",
      "revenueBreakdown": {
        "youtubeAds": "₹X",
        "sponsorDeal": "₹X",
        "brandDeal": "₹X",
        "clipsRevenue": "₹X",
        "longTailValue": "₹X",
        "brandLiftValue": "₹X"
      }
    },
    "base": {
      "totalRevenue": "₹X",
      "netROI": "₹X",
      "roiPercentage": "X%",
      "confidence": "X%",
      "revenueBreakdown": {
        "youtubeAds": "₹X",
        "sponsorDeal": "₹X",
        "brandDeal": "₹X",
        "clipsRevenue": "₹X",
        "longTailValue": "₹X",
        "brandLiftValue": "₹X"
      }
    },
    "high": {
      "totalRevenue": "₹X",
      "netROI": "₹X",
      "roiPercentage": "X%",
      "confidence": "X%",
      "revenueBreakdown": {
        "youtubeAds": "₹X",
        "sponsorDeal": "₹X",
        "brandDeal": "₹X",
        "clipsRevenue": "₹X",
        "longTailValue": "₹X",
        "brandLiftValue": "₹X"
      }
    }
  },
  "paybackPeriod": "e.g. 3.2 months",
  "breakEvenViews": "e.g. 45,000 views",
  "sensitivityWarning": "What happens if views drop 50%",
  "guestMonetizationScore": "7.5/10",
  "sponsorReadinessScore": "8/10",
  "clipROIScore": "6/10",
  "improvementActions": ["action1", "action2", "action3"],
  "roiGrade": "A / B / C / D",
  "verdict": "PROCEED / OPTIMIZE / RETHINK",
  "verdictReason": "2 line specific reasoning",
  "bestSponsorCategory": ""
}

ONLY valid JSON. NO MARKDOWN.`, "roi_calculator")
    const cleaned = text.replace(/```json|```/g, "").trim()
    setRoiResult(JSON.parse(cleaned))
  } catch (e) { alert("Error: " + e.message) }
  setRoiLoading(false)
}

const matchSponsors = async () => {
  if (!sponsorGuest.trim()) { alert("Please enter a guest name!"); return }
  if (!sponsorGuestType) { alert("Please select guest type!"); return }
  if (!sponsorTheme) { alert("Please select content theme!"); return }
  if (!sponsorAudience) { alert("Please select audience type!"); return }
  if (!sponsorObjective) { alert("Please select sponsor objective!"); return }
  if (!sponsorBudgetTier) { alert("Please select budget tier!"); return }
  if (!sponsorMarket) { alert("Please select market!"); return }
  setLoadingSponsors(true)
  setSponsorResult(null)
  setSponsorExcluded([])
  setSponsorSavedToPipeline(false)
  try {
    const customNote = sponsorCustomBrands.trim()
      ? `Also consider including these brands if relevant: ${sponsorCustomBrands}.`
      : ""
    const text = await callOpenAI(`You are a senior podcast monetization strategist for India's top business podcast "Figuring Out" by Raj Shamani.

${getYouTubeContext() ? "REAL DATA - " + getYouTubeContext() + "\nUse these actual recent episodes to understand what content themes perform best." : ""}
      EPISODE DETAILS:
- Guest: ${sponsorGuest}
- Guest Type: ${sponsorGuestType}
- Content Theme: ${sponsorTheme}
- Audience: ${sponsorAudience}
- Sponsor Objective: ${sponsorObjective}
- Budget Tier: ${sponsorBudgetTier}
- Market: ${sponsorMarket}
${customNote}

SCORING INSTRUCTIONS:
For each sponsor, score them on these 6 dimensions (1-10 each):
1. Audience Overlap — how well the sponsor's target customer matches this episode's audience
2. Category Match — how relevant the sponsor's industry is to the episode theme
3. Brand Affinity — how well the brand's values align with Raj Shamani's brand
4. Budget Likelihood — how likely this sponsor can afford this episode given the budget tier
5. Recency Relevance — is this brand actively running podcast/creator campaigns right now
6. Mismatch Risk — inverse score, 10 means very low risk of brand-guest conflict

Compute fitScore as the average of all 6 dimensions.

Return ONLY valid JSON, NO markdown:
{
  "guestName": "",
  "episodeSummary": "2 line summary of why this episode is monetizable",
  "sponsors": [
    {
      "brand": "",
      "category": "",
      "fitScore": 8.5,
      "scoringBreakdown": {
        "audienceOverlap": 9,
        "categoryMatch": 8,
        "brandAffinity": 9,
        "budgetLikelihood": 8,
        "recencyRelevance": 8,
        "mismatchRisk": 9
      },
      "whyFit": "2 line specific reason tied to guest and theme",
      "sponsorFormat": "Pre-roll / Mid-roll / Title Sponsor / Segment Sponsor",
      "estimatedDealINR": "e.g. ₹3-6 Lakhs",
      "contactAngle": "1 line on how to approach this brand",
      "pitchLine": "One ready-to-send pitch sentence",
      "confidence": "High / Medium / Low"
    }
  ],
  "totalEpisodeValue": "e.g. ₹18-30 Lakhs",
  "bestSponsorCategory": "",
  "strategistNote": "2 line overall monetization strategy for this episode"
}

Suggest exactly 6 sponsors ranked by fitScore. ONLY valid JSON. NO MARKDOWN.`, "sponsor_matchmaker")
    const cleaned = text.replace(/```json|```/g, "").trim()
    setSponsorResult(JSON.parse(cleaned))
  } catch (e) { alert("Error: " + e.message) }
  setLoadingSponsors(false)
}

  useEffect(() => {
    const key = localStorage.getItem("raj_api_key")
    const date = localStorage.getItem("raj_last_updated")
    const lastDate = localStorage.getItem("raj_last_date")
    const today = new Date().toLocaleDateString('en-IN')
    if (key) { setApiKey(key); setShowApiInput(false) }
    if (date) setLastUpdated(date)
    const saved = localStorage.getItem("raj_guests")
    if (saved) setGuests(JSON.parse(saved))
    loadPipelineFromSupabase()
    loadNotesFromSupabase()
    loadGuestHistoryFromSupabase()
    if (user?.email) fetchUserRole(user.email)

    if (saved && lastDate !== today && key) {
      localStorage.setItem("raj_last_date", today)
      setTimeout(() => generateGuests(key), 1500)
    } else if (!saved) {
      localStorage.setItem("raj_last_date", today)
    }
  }, [])

  const fetchOutcomes = async () => {
    const { data } = await supabase
      .from("episode_outcomes")
      .select("*")
      .order("episode_date", { ascending: false })
    if (data) setEpisodeOutcomes(data)
  }
  
  const saveOutcome = async () => {
    setOutcomesLoading(true)
    try {
      await supabase.from("episode_outcomes").insert({
        ...outcomeForm,
        predicted_views: parseInt(outcomeForm.predicted_views) || 0,
        actual_views: parseInt(outcomeForm.actual_views) || 0,
        watch_time_pct: parseFloat(outcomeForm.watch_time_pct) || 0,
        ctr: parseFloat(outcomeForm.ctr) || 0,
        retention: parseFloat(outcomeForm.retention) || 0,
        likes: parseInt(outcomeForm.likes) || 0,
        comments: parseInt(outcomeForm.comments) || 0,
        shares: parseInt(outcomeForm.shares) || 0,
        subscriber_lift: parseInt(outcomeForm.subscriber_lift) || 0,
        clip_count: parseInt(outcomeForm.clip_count) || 0,
        clip_views: parseInt(outcomeForm.clip_views) || 0,
        sponsor_value: parseInt(outcomeForm.sponsor_value) || 0,
        brand_deal: parseInt(outcomeForm.brand_deal) || 0,
        total_cost: parseInt(outcomeForm.total_cost) || 0,
        outreach_days: parseInt(outcomeForm.outreach_days) || 0,
        approval_days: parseInt(outcomeForm.approval_days) || 0,
        logged_by: user?.email
      })
      await fetchOutcomes()
      setShowOutcomeForm(false)
      setOutcomeForm({
        guest_name: "", guest_type: "", episode_date: "", episode_title: "",
        predicted_views: "", actual_views: "", watch_time_pct: "", ctr: "",
        retention: "", likes: "", comments: "", shares: "", subscriber_lift: "",
        clip_count: "", clip_views: "", sponsor_value: "", brand_deal: "",
        total_cost: "", outreach_days: "", approval_days: "", notes: ""
      })
    } catch(e) { alert("Error saving: " + e.message) }
    setOutcomesLoading(false)
  }
  
  const generateOutcomeInsights = async () => {
    if (episodeOutcomes.length === 0) return
    setOutcomesLoading(true)
    const summary = episodeOutcomes.slice(0, 10).map(e =>
      `Guest: ${e.guest_name} (${e.guest_type}), Views: ${e.actual_views}, CTR: ${e.ctr}%, Retention: ${e.retention}%, Sponsor: ₹${e.sponsor_value}, ROI: ${e.total_cost > 0 ? ((e.sponsor_value + e.brand_deal) / e.total_cost * 100).toFixed(0) : 0}%`
    ).join("\n")
    const prompt = `You are a podcast growth strategist for "Figuring Out" by Raj Shamani. Analyze these episode outcomes and provide 5 specific actionable insights:\n\n${summary}${getYouTubeContext() ? "\nREAL DATA - " + getYouTubeContext() + "\nCross-reference these real recent episodes with the outcome data above." : ""}\n\nReturn ONLY a JSON array of 5 objects with: { insight, category, action, impact } where category is one of: Content, Guest, Revenue, Workflow, Growth. No markdown.`
    try {
      const result = await callOpenAI(prompt, "outcome_insights")
      const cleaned = result.replace(/```json|```/g, "").trim()
      setOutcomeInsights(JSON.parse(cleaned))
    } catch(e) { alert("Error generating insights") }
    setOutcomesLoading(false)
  }

  const saveApiKey = (key) => { setApiKey(key); localStorage.setItem("raj_api_key", key) }

  const fetchUserRole = async (email) => {
    const { data } = await supabase
      .from("team_members")
      .select("role")
      .eq("email", email)
      .eq("is_active", true)
      .single()
    if (data) {
      setUserRole(data.role)
    } else {
      setUserRole("viewer")
    }
  }

  const requestApproval = async (guestName, approvalType, content = {}) => {
    const { data, error } = await supabase.from("approval_requests").insert({
      guest_name: guestName,
      approval_type: approvalType,
      status: "pending",
      requested_by: user?.email,
      content: content
    })
    if (!error) {
      await logActivity("requested_approval", "guest", guestName, `${approvalType} approval requested`)
      fetchApprovals()
    }
  }
  
  const approveItem = async (approvalId, guestName, comment = "") => {
    await supabase.from("approval_requests").update({
      status: "approved",
      reviewed_by: user?.email,
      comment: comment,
      updated_at: new Date().toISOString()
    }).eq("id", approvalId)
    await logActivity("approved", "guest", guestName, comment)
    fetchApprovals()
  }
  
  const rejectItem = async (approvalId, guestName, comment = "") => {
    await supabase.from("approval_requests").update({
      status: "rejected",
      reviewed_by: user?.email,
      comment: comment,
      updated_at: new Date().toISOString()
    }).eq("id", approvalId)
    await logActivity("rejected", "guest", guestName, comment)
    fetchApprovals()
  }
  
  const logActivity = async (action, targetType, targetName, details = "") => {
    await supabase.from("activity_log").insert({
      user_email: user?.email,
      action: action,
      target_type: targetType,
      target_name: targetName,
      details: details
    })
  }
  
  const fetchApprovals = async () => {
    const { data } = await supabase
      .from("approval_requests")
      .select("*")
      .order("created_at", { ascending: false })
    if (data) {
      setApprovalRequests(data)
      setPendingCount(data.filter(a => a.status === "pending").length)
    }
  }

  const addToPipeline = async (guest, from = "category") => {
    if (pipeline.find(p => p.name === guest.name)) { alert(`${guest.name} is already in pipeline!`); return }
    const updated = [...pipeline, { ...guest, addedFrom: from, pipelineDate: new Date().toLocaleDateString('en-IN'), recordingDate: "" }]
    setPipeline(updated)
    localStorage.setItem("raj_pipeline", JSON.stringify(updated))
    await savePipelineToSupabase(updated)
    alert(`${guest.name} added to Pipeline!`)
  }

  const removeFromPipeline = async (index) => {
    if (!window.confirm("Remove this guest from pipeline?")) return
    const updated = pipeline.filter((_, i) => i !== index)
    setPipeline(updated)
    localStorage.setItem("raj_pipeline", JSON.stringify(updated))
    await savePipelineToSupabase(updated)
  }

  const updatePipelineStatus = async (index, status) => {
    const updated = [...pipeline]; updated[index].status = status
    setPipeline(updated); localStorage.setItem("raj_pipeline", JSON.stringify(updated))
    await savePipelineToSupabase(updated)
  }

  const updateRecordingDate = async (index, date) => {
    const updated = [...pipeline]; updated[index].recordingDate = date
    setPipeline(updated); localStorage.setItem("raj_pipeline", JSON.stringify(updated))
    await savePipelineToSupabase(updated)
  }

  const saveNote = async (guestName) => {
    const updated = { ...notes, [guestName]: [...(notes[guestName] || []), { text: noteText, date: new Date().toLocaleString('en-IN') }] }
    setNotes(updated); localStorage.setItem("raj_notes", JSON.stringify(updated))
    await saveNotesToSupabase(guestName, updated[guestName])
    setNoteText(""); setEditingNote(null)
  }

  const exportToCSV = (data, filename) => {
    const headers = ["Name", "Category", "Score", "Priority", "Virality", "Relevance", "Value", "Status", "Why Now", "Topic Angle", "First Time"]
    const rows = data.map(g => [g.name, g.category, g.total, g.priority, g.virality, g.relevance, g.value, g.status || "New", (g.whyNow || "").replace(/,/g, ";"), (g.topicAngle || "").replace(/,/g, ";"), g.lastAppeared === "Never" ? "Yes" : "No"])
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url; a.download = filename; a.click()
    URL.revokeObjectURL(url)
  }

  const exportGuestsToCSV = () => exportToCSV(guests, `raj-guests-${new Date().toLocaleDateString("en-IN").replace(/\//g, "-")}.csv`)
  const exportPipelineToCSV = () => exportToCSV(pipeline, `raj-pipeline-${new Date().toLocaleDateString("en-IN").replace(/\//g, "-")}.csv`)

  const generateTitles = async (guest) => {
    if (!apiKey) return
    setLoadingTitles(true); setTitleGuest(guest); setTitles([]); setShowTitles(true)
    try {
      const text = await callOpenAI(`Viral YouTube/podcast title expert for "Figuring Out With Raj Shamani".
Guest: ${guest.name} (${guest.category}), Topic: ${guest.topicAngle}, Why Now: ${guest.whyNow}
${getYouTubeContext() ? "REAL DATA - " + getYouTubeContext() + "\nStudy these real episode title patterns and match Raj's proven style." : ""}
Generate 5 viral episode titles. Under 70 chars each. Curiosity-driven, emotional.
Return ONLY valid JSON array of 5 strings. NO MARKDOWN.`)
      const cleaned = text.replace(/```json|```/g, "").trim()
      setTitles(JSON.parse(cleaned))
    } catch (e) { alert("Error: " + e.message) }
    setLoadingTitles(false)
  }

  const generateBrief = async (guest) => {
    if (!apiKey) return
    setLoadingBrief(true); setBriefGuest(guest); setBrief(""); setShowBrief(true)
    try {
      const text = await callOpenAI(`Generate a one-page Pre-Interview Brief for Raj Shamani before interviewing ${guest.name} (${guest.category}).
        ${getYouTubeContext() ? "REAL DATA - " + getYouTubeContext() + "\nIf this guest or similar category appeared recently, find a fresh angle." : ""}
Include: 1. GUEST SNAPSHOT 2. COMMUNICATION STYLE 3. TOPICS THEY LOVE 4. SENSITIVE TOPICS TO AVOID 5. BEST CONVERSATION OPENERS 6. VIRAL MOMENT TRIGGERS 7. DOs AND DONTs 8. ENERGY LEVEL
Be specific to ${guest.name}. Factual and practical.`)
      setBrief(text)
    } catch (e) { alert("Error: " + e.message) }
    setLoadingBrief(false)
  }

  const generateAlignment = async (guest) => {
    if (!apiKey) return
    setLoadingAlignment(guest.name)
    try {
      const text = await callOpenAI(`Analyse audience alignment between "${guest.name}" (${guest.category}) and "Figuring Out With Raj Shamani". Raj's audience: Young Indians 18-35.
${getYouTubeContext() ? "REAL DATA - " + getYouTubeContext() + "\nUse these real recent episodes to understand what guest types and topics Raj's audience currently responds to. Score alignment based on actual patterns." : ""}
Score 1-10: ageMatch, interestMatch, aspirational, controversy, shareability, overall
Return ONLY valid JSON: { "ageMatch": 0, "interestMatch": 0, "aspirational": 0, "controversy": 0, "shareability": 0, "overall": 0, "verdict": "", "recommendation": "BOOK NOW or CONSIDER or SKIP" }
ONLY valid JSON. NO MARKDOWN.`)
      const cleaned = text.replace(/```json|```/g, "").trim()
      setAlignmentData(prev => ({ ...prev, [guest.name]: JSON.parse(cleaned) }))
    } catch (e) { alert("Error: " + e.message) }
    setLoadingAlignment(null)
  }

  const runGlobalSearch = async () => {
    if (!globalSearch.trim() || !apiKey) { if (!apiKey) alert("Please enter your OpenAI API key first!"); return }
    setLoadingGlobalSearch(true); setGlobalSearchResult(null)
    const inPastGuests = PAST_GUESTS.toLowerCase().includes(globalSearch.toLowerCase())
    const inPipeline = pipeline.find(g => g.name.toLowerCase().includes(globalSearch.toLowerCase()))
    const inToday = guests.find(g => g.name.toLowerCase().includes(globalSearch.toLowerCase()))
    const recentGuests = JSON.parse(localStorage.getItem("raj_recent_guests") || "[]")
    const inRecent = recentGuests.find(n => n.toLowerCase().includes(globalSearch.toLowerCase()))
    try {
      const text = await callOpenAI(`Complete profile for: "${globalSearch}"
${getYouTubeContext() ? "REAL DATA - " + getYouTubeContext() + "\nIf this person appeared in any recent episode, note it. If not, highlight that as a fresh opportunity for Raj." : ""}
Return ONLY valid JSON: { "fullName": "", "age": "", "category": "", "tagline": "", "background": "", "achievements": ["","","",""], "currentStatus": "", "socialFollowing": "", "netWorth": "", "whyNowForRaj": "", "bestAngle": "", "audienceMatch": 0, "controversies": "", "audienceDemographics": "", "viralPotential": 0, "recommendation": "BOOK NOW or CONSIDER or SKIP", "recommendationReason": "" }
ONLY valid JSON. NO MARKDOWN.`)
      const cleaned = text.replace(/```json|```/g, "").trim()
      setGlobalSearchResult({ ...JSON.parse(cleaned), inPastGuests, inPipeline: inPipeline || null, inToday: inToday || null, inRecent: !!inRecent, searchedName: globalSearch })
    } catch (e) { alert("Error: " + e.message) }
    setLoadingGlobalSearch(false)
  }

  const replaceGuest = async (index) => {
    if (!apiKey) return
    setReplacingIndex(index)
    const existingNames = guests.map(g => g.name).join(", ")
    const recentGuests = await loadRecentGuestsFromSupabase()
    try {
      const text = await callOpenAI(`Suggest 1 fresh exclusive podcast guest for "Figuring Out With Raj Shamani".
PHILOSOPHY: NOT a celebrity. Find an exclusive voice — domain expert, insider, someone with a unique untold story.
${getYouTubeContext() ? "REAL DATA - " + getYouTubeContext() + "\nDo NOT suggest topics or guests that overlap with these recent episodes." : ""}
Avoid: ${PAST_GUESTS}, ${existingNames}, ${recentGuests.join(", ")}
Must be alive. Must NOT be a deceased person.
Return JSON: name, category, whyNow, topicAngle, virality(1-10), relevance(1-10), value(1-10), lastAppeared, repeatReason, isAISlot(false)
ONLY valid JSON. NO MARKDOWN.`)
      const cleaned = text.replace(/```json|```/g, "").trim()
      const parsed = JSON.parse(cleaned)
      const newGuest = { ...parsed, total: ((parsed.virality + parsed.relevance + parsed.value) / 3).toFixed(1), priority: ((parsed.virality + parsed.relevance + parsed.value) / 3) >= 8 ? "High" : ((parsed.virality + parsed.relevance + parsed.value) / 3) >= 6 ? "Medium" : "Low", status: "New", addedDate: new Date().toLocaleDateString('en-IN') }
      const updated = [...guests]; updated[index] = newGuest
      setGuests(updated); localStorage.setItem("raj_guests", JSON.stringify(updated))
    } catch (e) { alert("Error: " + e.message) }
    setReplacingIndex(null)
  }

  const generateResearch = async (guest) => {
    if (!apiKey) return
    setIntelLoading(true)
    setintelGuest(guest)
    setShowIntel(true)
    setIntelData(null)
    try {
      const prompt = `You are a senior research analyst for "Figuring Out" podcast by Raj Shamani. Raj's philosophy: "stop chasing famous names, find exclusive voices no one else has."
      ${getYouTubeContext() ? "REAL DATA - " + getYouTubeContext() + "\nIf this guest or similar topic appeared in recent episodes, find a fresh unique angle." : ""}

  Create a sourced intelligence brief for: ${guest.name} (${guest.category})
  
  Return ONLY a JSON object with these exact keys:
  {
    "executive_summary": "3-4 line overview of who this person is and why they matter",
    "why_raj": "Why this is an EXCLUSIVE voice Raj should have — not mainstream, not overexposed",
    "why_now": "Current trend or event that makes this guest timely right now",
    "achievements": [{"fact": "achievement", "tag": "verified|inferred", "source": "source name or URL"}],
    "risks": [{"flag": "risk or sensitivity", "severity": "low|medium|high"}],
    "audience_fit": "How well this guest fits Raj's 18-35 young Indian audience and why",
    "episode_angle": "The single best episode angle — specific, not generic",
    "intro_hook": "A 2-line intro Raj could actually use to open the episode",
    "questions": ["question 1", "question 2", "question 3", "question 4", "question 5", "question 6", "question 7"],
    "sponsor_fit": "Which sponsor categories this guest attracts and why",
    "sources": ["source 1", "source 2", "source 3"]
  }
  
  Be specific, factual, and research-grade. NO markdown, NO generic statements.`
      const result = await callOpenAI(prompt, "sourced_brief")
      const cleaned = result.replace(/```json|```/g, "").trim()
      setIntelData(JSON.parse(cleaned))
    } catch(e) { alert("Error generating brief: " + e.message) }
    setIntelGuest(false)
  }
  const generateQuestions = async (guest) => {
    if (!apiKey) return
    setLoading(true); setSelectedGuest(guest); setView("questions")
    try {
      const text = await callOpenAI(`20 powerful interview questions for Raj Shamani's podcast: ${guest.name} (${guest.category})
Style: Raw, honest, value-driven. Audience: young Indians 18-35.
3 HOOK, 5 STORY, 5 DEEP VALUE, 4 CONTROVERSIAL BUT FAIR, 3 VIRAL CLIP questions.
${getYouTubeContext() ? "REAL DATA - " + getYouTubeContext() + "\nStudy these real episodes and make sure questions cover angles Raj has NOT explored yet." : ""}
Specific to ${guest.name}, not generic.`)
      setQuestions(text)
    } catch (e) { alert("Error: " + e.message) }
    setLoading(false)
  }

  const generateOutreach = async (guest) => {
    if (!apiKey) return
    setLoading(true); setSelectedGuest(guest); setView("outreach")
    setOutreach({ subject: "", body: "", recipientEmail: "" })
    try {
      const text = await callOpenAI(`Professional outreach email from Raj Shamani's team to ${guest.name} (${guest.category}).
Show: India's top podcast, 500+ episodes, young Indians 18-35. Under 200 words.
${getYouTubeContext() ? "REAL DATA - " + getYouTubeContext() + "\nReference a relevant recent episode topic in the email to show Raj's credibility and relevance to this guest." : ""}
Return ONLY valid JSON: { "subject": "", "body": "" }
ONLY valid JSON. NO markdown.`)
      const cleaned = text.replace(/```json|```/g, "").trim()
      const parsed = JSON.parse(cleaned)
      setOutreach({ subject: parsed.subject || "", body: parsed.body || "", recipientEmail: "" })
    } catch (e) { alert("Error: " + e.message) }
    setLoading(false)
  }

  const generateWhatsapp = async (guest) => {
    if (!apiKey) return
    setLoadingWhatsapp(true); setWhatsappMsg("")
    try {
      const text = await callOpenAI(`Casual WhatsApp message from Raj Shamani's team to ${guest.name} (${guest.category}) inviting them on the podcast.
Max 100 words, very casual and warm, 2-3 emojis, end with a question.
${getYouTubeContext() ? "REAL DATA - " + getYouTubeContext() + "\nMention a relevant recent episode to make the message feel personal and credible." : ""}
Return ONLY the message text. No JSON. No labels.`)
      setWhatsappMsg(text.trim())
    } catch (e) { alert("Error: " + e.message) }
    setLoadingWhatsapp(false)
  }

  const openInGmail = () => window.open(`mailto:${outreach.recipientEmail || ""}?subject=${encodeURIComponent(outreach.subject)}&body=${encodeURIComponent(outreach.body)}`, "_blank")
  const openInWhatsApp = () => window.open(`https://wa.me/?text=${encodeURIComponent(whatsappMsg)}`, "_blank")
  const copyEmailBody = () => { navigator.clipboard.writeText(`Subject: ${outreach.subject}\n\n${outreach.body}`); setCopiedEmail(true); setTimeout(() => setCopiedEmail(false), 2000) }
  const copyWhatsApp = () => { navigator.clipboard.writeText(whatsappMsg); setCopiedWA(true); setTimeout(() => setCopiedWA(false), 2000) }

  const toggleCompare = (guest) => {
    const exists = comparedGuests.find(g => g.name === guest.name)
    if (exists) { setComparedGuests(comparedGuests.filter(g => g.name !== guest.name)) }
    else {
      if (comparedGuests.length >= 3) { alert("Max 3 guests allowed for comparison!"); return }
      setComparedGuests([...comparedGuests, guest])
    }
  }

  const priorityColor = (p) => p === "High" ? "#00ff88" : p === "Medium" ? "#ffaa00" : "#ff6666"
  const statusColor = (s) => s === "Booked" ? "#00ff88" : s === "Contacted" ? "#ffaa00" : s === "Declined" ? "#ff6666" : "#666"
  const heatColor = (h) => h >= 8 ? "#ff4444" : h >= 6 ? "#ff8800" : "#ffcc00"
  const sentimentColor = (s) => s === "Positive" ? "#00ff88" : s === "Negative" ? "#ff6666" : s === "Mixed" ? "#ffaa00" : "#9ca3af"
  const availabilityColor = (s) => s === "Very Easy" || s === "Easy" ? "#00ff88" : s === "Moderate" ? "#ffaa00" : "#ff6666"

  const filteredDisplayGuests = (activeCategory === "all" ? guests : categoryGuests).filter(g => {
    const matchSearch = !searchQuery || g.name.toLowerCase().includes(searchQuery.toLowerCase()) || g.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchPriority = filterPriority === "All" || g.priority === filterPriority
    const matchStatus = filterStatus === "All" || g.status === filterStatus
    return matchSearch && matchPriority && matchStatus
  })

  const filteredPipeline = pipeline
    .filter(g => pipelineFilter === "All" || g.status === pipelineFilter)
    .sort((a, b) => pipelineSort === "score" ? b.total - a.total : pipelineSort === "date" ? new Date(b.pipelineDate) - new Date(a.pipelineDate) : a.name.localeCompare(b.name))

  const ActionButtons = ({ g, compact = false }) => {
    const p = compact ? "5px 6px" : "8px"
    const fs = compact ? "11px" : "12px"
    return (
      <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
        <button onClick={() => generateResearch(g)} style={{ flex: 1, padding: p, borderRadius: "7px", background: "#1e3a5f", color: "#60a5fa", border: "1px solid #1e40af", cursor: "pointer", fontSize: fs }}>{compact ? "📋" : "📋 Research"}</button>
        <button onClick={() => generateOutreach(g)} style={{ flex: 1, padding: p, borderRadius: "7px", background: "#1a2e1a", color: "#4ade80", border: "1px solid #166534", cursor: "pointer", fontSize: fs }}>{compact ? "✉️" : "✉️ Outreach"}</button>
        <button onClick={() => generateQuestions(g)} style={{ flex: 1, padding: p, borderRadius: "7px", background: "#2d1a3e", color: "#c084fc", border: "1px solid #6b21a8", cursor: "pointer", fontSize: fs }}>{compact ? "❓" : "❓ Questions"}</button>
        <button onClick={() => { setSelectedGuest(g); generateWhatsapp(g); setView("whatsapp") }} style={{ flex: 1, padding: p, borderRadius: "7px", background: "#1a2e1a", color: "#25d366", border: "1px solid #128c7e", cursor: "pointer", fontSize: fs }}>{compact ? "💬" : "💬 WhatsApp"}</button>
      </div>
    )
  }

  const GuestCard = ({ g, i, source = "main", showAddToPipeline = false }) => {
    const isCompared = !!comparedGuests.find(c => c.name === g.name)
    return (
      <div style={{ background: g.isAISlot ? "linear-gradient(135deg,#1a0a2e,#0d1a3c)" : "#111827", borderRadius: "12px", padding: isMobile ? "14px" : "20px", border: `1px solid ${isCompared ? "#7c3aed" : g.isAISlot ? "#7c3aed" : priorityColor(g.priority) + "33"}`, opacity: replacingIndex === i ? 0.5 : 1, transition: "all 0.3s" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px", flexWrap: "wrap" }}>
              <h3 style={{ margin: 0, fontSize: isMobile ? "15px" : "16px" }}>{replacingIndex === i ? "Finding..." : g.name}</h3>
              {g.isAISlot && <span style={{ fontSize: "10px", background: "#7c3aed", color: "#fff", padding: "2px 7px", borderRadius: "10px" }}>AI Expert</span>}
            </div>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
              <span style={{ fontSize: "12px", background: "#1e1e3f", color: "#a78bfa", padding: "2px 8px", borderRadius: "20px" }}>{g.category}</span>
              {g.lastAppeared === "Never" || g.lastAppeared === "First appearance"
                ? <span style={{ fontSize: "11px", color: "#00ff88" }}>First Time</span>
                : <span style={{ fontSize: "11px", color: "#f59e0b" }}>Repeat ({g.lastAppeared})</span>}
            </div>
          </div>
          <div style={{ textAlign: "right", marginLeft: "10px" }}>
            <div style={{ fontSize: "24px", fontWeight: "bold", color: priorityColor(g.priority) }}>{g.total}</div>
            <div style={{ fontSize: "11px", color: priorityColor(g.priority), fontWeight: "bold" }}>{g.priority}</div>
          </div>
        </div>
        <p style={{ fontSize: "13px", color: "#9ca3af", margin: "0 0 6px", lineHeight: "1.5" }}><span style={{ color: "#f59e0b" }}>Why Now:</span> {g.whyNow}</p>
        <p style={{ fontSize: "13px", color: "#9ca3af", margin: "0 0 12px", lineHeight: "1.5" }}><span style={{ color: "#60a5fa" }}>Angle:</span> {g.topicAngle}</p>
        <div style={{ display: "flex", gap: "6px", marginBottom: "10px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "11px", background: "#1f2937", padding: "3px 10px", borderRadius: "6px" }}>Virality {g.virality}</span>
          <span style={{ fontSize: "11px", background: "#1f2937", padding: "3px 10px", borderRadius: "6px" }}>Relevance {g.relevance}</span>
          <span style={{ fontSize: "11px", background: "#1f2937", padding: "3px 10px", borderRadius: "6px" }}>Value {g.value}</span>
        </div>
        <div style={{ marginBottom: "8px" }}>
          <select value={g.status} onChange={e => { if (source === "main") { const u = [...guests]; u[i].status = e.target.value; setGuests(u); localStorage.setItem("raj_guests", JSON.stringify(u)) } }}
            style={{ width: "100%", padding: "7px", borderRadius: "6px", background: "#1f2937", color: statusColor(g.status), border: `1px solid ${statusColor(g.status)}`, fontSize: "12px", cursor: "pointer" }}>
            <option value="New">New</option><option value="Contacted">Contacted</option><option value="Booked">Booked</option><option value="Declined">Declined</option>
          </select>
        </div>
        <div style={{ marginBottom: "8px" }}><ActionButtons g={g} /></div>
        {alignmentData[g.name] ? (
          <div style={{ marginBottom: "8px", background: "#0d1117", borderRadius: "8px", padding: "10px 12px", border: `1px solid ${alignmentData[g.name].overall >= 8 ? "#166534" : alignmentData[g.name].overall >= 6 ? "#92400e" : "#7f1d1d"}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <span style={{ fontSize: "11px", color: "#6b7280", fontWeight: "bold" }}>AUDIENCE ALIGNMENT</span>
              <span style={{ fontSize: "18px", fontWeight: "bold", color: alignmentData[g.name].overall >= 8 ? "#00ff88" : alignmentData[g.name].overall >= 6 ? "#ffaa00" : "#ff6666" }}>{alignmentData[g.name].overall}/10</span>
            </div>
            <div style={{ fontSize: "11px", color: "#9ca3af", marginBottom: "4px" }}>{alignmentData[g.name].verdict}</div>
            <span style={{ fontSize: "11px", fontWeight: "bold", padding: "2px 8px", borderRadius: "6px", background: alignmentData[g.name].recommendation === "BOOK NOW" ? "#14532d" : alignmentData[g.name].recommendation === "CONSIDER" ? "#78350f" : "#7f1d1d", color: alignmentData[g.name].recommendation === "BOOK NOW" ? "#4ade80" : alignmentData[g.name].recommendation === "CONSIDER" ? "#fbbf24" : "#f87171" }}>
              {alignmentData[g.name].recommendation}
            </span>
          </div>
        ) : (
          <button onClick={() => generateAlignment(g)} disabled={loadingAlignment === g.name}
            style={{ width: "100%", marginBottom: "8px", padding: "7px", borderRadius: "8px", background: "#0d1117", color: "#60a5fa", border: "1px solid #1e3a5f", cursor: loadingAlignment === g.name ? "not-allowed" : "pointer", fontSize: "12px" }}>
            {loadingAlignment === g.name ? "⏳ Analysing..." : "🎯 Audience Alignment Score"}
          </button>
        )}
        <button onClick={() => generateTitles(g)} style={{ width: "100%", marginBottom: "8px", padding: "7px", borderRadius: "8px", background: "#1a0a2e", color: "#c084fc", border: "1px solid #6b21a8", cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}>🎬 Suggest Episode Titles</button>
        <button onClick={() => generateBrief(g)} style={{ width: "100%", marginBottom: "8px", padding: "7px", borderRadius: "8px", background: "#1a1a0a", color: "#fbbf24", border: "1px solid #92400e", cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}>📄 Pre-Interview Brief</button>
        {showAddToPipeline && <button onClick={() => addToPipeline(g, "category")} style={{ width: "100%", marginBottom: "6px", padding: "8px", borderRadius: "8px", background: "#1a2e3f", color: "#38bdf8", border: "1px solid #0369a1", cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}>Add to Pipeline</button>}
        {source === "main" && <button onClick={() => addToPipeline(g, "daily")} style={{ width: "100%", marginBottom: "6px", padding: "7px", borderRadius: "8px", background: "#1a2e3f", color: "#38bdf8", border: "1px solid #0369a1", cursor: "pointer", fontSize: "12px" }}>Add to Pipeline</button>}
        <button onClick={() => requestApproval(g.name, "guest_selection", { category: g.category, score: g.total })} style={{ width: "100%", marginTop: "6px", padding: "8px", borderRadius: "8px", background: "#1e3a5f", color: "#38bdf8", border: "1px solid #38bdf8", cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}>
  🔔 Request Approval
</button>
        {!g.isAISlot && source === "main" && <button onClick={() => replaceGuest(i)} disabled={replacingIndex === i} style={{ width: "100%", marginBottom: "6px", padding: "7px", borderRadius: "8px", background: "#2a1a1a", color: "#f87171", border: "1px solid #7f1d1d", cursor: replacingIndex === i ? "not-allowed" : "pointer", fontSize: "12px" }}>{replacingIndex === i ? "Finding..." : "Replace This Guest"}</button>}
        <button onClick={() => toggleCompare(g)} style={{ width: "100%", padding: "7px", borderRadius: "8px", background: isCompared ? "#1a3a2a" : "#1a1a2e", color: isCompared ? "#4ade80" : "#a78bfa", border: `1px solid ${isCompared ? "#166534" : "#4c1d95"}`, cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}>
          {isCompared ? "Added to Compare" : "Compare"}
        </button>
      </div>
    )
  }

  if (loadingAccess) return (
  <div style={{ minHeight: "100vh", background: "#0a0a0f", display: "flex", alignItems: "center", justifyContent: "center" }}>
    <div style={{ textAlign: "center", color: "#a78bfa" }}><div style={{ fontSize: "40px", marginBottom: "16px" }}>🎙️</div><p>Checking access...</p></div>
  </div>
)

if (accessStatus === "pending") return (
  <div style={{ minHeight: "100vh", background: "#0a0a0f", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
    <div style={{ textAlign: "center", background: "#111827", borderRadius: "16px", padding: "40px", maxWidth: "480px", border: "1px solid #a78bfa" }}>
      <div style={{ fontSize: "48px", marginBottom: "16px" }}>⏳</div>
      <h2 style={{ color: "#a78bfa", marginBottom: "12px" }}>Access Pending Approval</h2>
      <p style={{ color: "#cbd5e1", marginBottom: "8px" }}>Your request has been sent to the admin.</p>
      <p style={{ color: "#64748b", fontSize: "13px", marginBottom: "24px" }}>You'll be able to access the app once approved. Please check back later.</p>
      <button onClick={logout} style={{ padding: "10px 24px", borderRadius: "8px", background: "#2a1a1a", color: "#f87171", border: "1px solid #7f1d1d", cursor: "pointer" }}>Sign Out</button>
    </div>
  </div>
)

if (accessStatus === "rejected") return (
  <div style={{ minHeight: "100vh", background: "#0a0a0f", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
    <div style={{ textAlign: "center", background: "#111827", borderRadius: "16px", padding: "40px", maxWidth: "480px", border: "1px solid #ef4444" }}>
      <div style={{ fontSize: "48px", marginBottom: "16px" }}>❌</div>
      <h2 style={{ color: "#ef4444", marginBottom: "12px" }}>Access Denied</h2>
      <p style={{ color: "#cbd5e1", marginBottom: "24px" }}>Your access request was not approved. Contact the admin for more information.</p>
      <button onClick={logout} style={{ padding: "10px 24px", borderRadius: "8px", background: "#2a1a1a", color: "#f87171", border: "1px solid #7f1d1d", cursor: "pointer" }}>Sign Out</button>
    </div>
  </div>
)

return (
    <div style={{ minHeight: "100vh", background: darkMode ? "#0a0a0f" : "#f0f4f8", color: darkMode ? "#fff" : "#111", fontFamily: "'Segoe UI',sans-serif" }}>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg,#1a0533,#0d1f3c)", padding: isMobile ? "14px 16px" : "20px 30px", borderBottom: "1px solid #333" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px", marginBottom: "10px" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: isMobile ? "17px" : "22px", background: "linear-gradient(90deg,#a855f7,#3b82f6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>🎙️ Figuring Out — Guest Intelligence</h1>
            <p style={{ margin: "4px 0 0", fontSize: "11px", color: "#888" }}>
              AI-Powered • 500+ Guests Tracked {lastUpdated && `• Updated: ${lastUpdated}`}
              {syncStatus && <span style={{ color: syncStatus.includes("✓") ? "#4ade80" : syncStatus.includes("fail") ? "#f87171" : "#f59e0b" }}> • ☁️ {syncStatus}</span>}
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            {user && <span style={{ fontSize: "11px", color: "#4ade80" }}>👤 {user.email}</span>}
            {!isMobile && showApiInput && <input placeholder="Enter OpenAI API Key" value={apiKey} onChange={e => saveApiKey(e.target.value)} style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid #444", background: "#1a1a2e", color: "#fff", fontSize: "13px", width: "220px" }} />}
            <button onClick={logout} style={{ padding: "7px 12px", borderRadius: "8px", background: "#2a1a1a", color: "#f87171", border: "1px solid #7f1d1d", cursor: "pointer", fontSize: isMobile ? "11px" : "12px" }}>Sign Out</button>
          </div>
        </div>
        {isMobile && showApiInput && <input placeholder="Enter OpenAI API Key" value={apiKey} onChange={e => saveApiKey(e.target.value)} style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #444", background: "#1a1a2e", color: "#fff", fontSize: "13px", marginBottom: "10px", boxSizing: "border-box" }} />}
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
          <button onClick={() => setShowApiInput(!showApiInput)} style={{ padding: "7px 10px", borderRadius: "8px", background: "#333", color: "#aaa", border: "none", cursor: "pointer", fontSize: "11px" }}>{showApiInput ? "Hide Key" : "API Key"}</button>
          <button onClick={() => { setView("home"); setActiveCategory("all"); setCategoryGuests([]) }} style={{ padding: "7px 12px", borderRadius: "8px", background: view === "home" ? "#2e1e5f" : "#1e1e3f", color: "#a78bfa", border: "1px solid #4c1d95", cursor: "pointer", fontSize: isMobile ? "12px" : "13px" }}>🏠 Home</button>
          <button onClick={() => setView("pipeline")} style={{ padding: "7px 12px", borderRadius: "8px", background: view === "pipeline" ? "#164e63" : "#1e1e3f", color: "#38bdf8", border: "1px solid #0369a1", cursor: "pointer", fontSize: isMobile ? "12px" : "13px" }}>📋 {pipeline.length > 0 ? `Pipeline (${pipeline.length})` : "Pipeline"}</button>
          <button onClick={() => setView("planner")} style={{ padding: "7px 12px", borderRadius: "8px", background: view === "planner" ? "#14532d" : "#1e1e3f", color: "#4ade80", border: "1px solid #166534", cursor: "pointer", fontSize: isMobile ? "12px" : "13px" }}>📅 Planner</button>
          <button onClick={() => { setView("trending"); if (trends.length === 0) fetchTrends() }} style={{ padding: "7px 12px", borderRadius: "8px", background: view === "trending" ? "#7c2d12" : "#1e1e3f", color: "#fb923c", border: "1px solid #9a3412", cursor: "pointer", fontSize: isMobile ? "12px" : "13px" }}>🔥 Trending</button>
          <button onClick={() => { setView("competitors"); if (competitors.length === 0) fetchCompetitors() }} style={{ padding: "7px 12px", borderRadius: "8px", background: view === "competitors" ? "#1e1b4b" : "#1e1e3f", color: "#818cf8", border: "1px solid #3730a3", cursor: "pointer", fontSize: isMobile ? "12px" : "13px" }}>🏆 Competitors</button>
          <button onClick={() => setView("sentiment")} style={{ padding: "7px 12px", borderRadius: "8px", background: view === "sentiment" ? "#0f3320" : "#1e1e3f", color: "#34d399", border: "1px solid #065f46", cursor: "pointer", fontSize: isMobile ? "12px" : "13px" }}>📊 Sentiment</button>
          <button onClick={() => setView("availability")} style={{ padding: "7px 12px", borderRadius: "8px", background: view === "availability" ? "#1c1400" : "#1e1e3f", color: "#fcd34d", border: "1px solid #92400e", cursor: "pointer", fontSize: isMobile ? "12px" : "13px" }}>🗓️ Availability</button>
          <button onClick={() => setView("sponsors")} style={{ padding: "7px 12px", borderRadius: "8px", background: view === "sponsors" ? "#1a0533" : "#1e1e3f", color: "#e879f9", border: "1px solid #7e22ce", cursor: "pointer", fontSize: isMobile ? "12px" : "13px" }}>💰 Sponsors</button>
          <button onClick={() => setView("performance")} style={{ padding: "7px 12px", borderRadius: "8px", background: view === "performance" ? "#6c63ff" : "transparent", color: "white", border: "1px solid #444", cursor: "pointer", fontSize: "12px" }}>📊 Performance</button>
          <button onClick={() => { setView("team"); fetchApprovals() }} style={{ padding: "7px 12px", borderRadius: "8px", background: view === "team" ? "#1a6535" : "transparent", color: darkMode ? "#fff" : "#000", border: "1px solid #333", cursor: "pointer", position: "relative" }}>
  👥 Team {pendingCount > 0 && <span style={{ background: "#e74c3c", color: "#fff", borderRadius: "50%", padding: "1px 5px", fontSize: "10px", marginLeft: "4px" }}>{pendingCount}</span>}
</button>
<button onClick={() => { setView("outcomes"); fetchOutcomes() }} style={{ padding: "7px 12px", borderRadius: "8px", background: view === "outcomes" ? "#1a6535" : "transparent", color: darkMode ? "#fff" : "#000", border: "1px solid #333", cursor: "pointer" }}>
  📊 Outcomes
</button>
          <button onClick={() => setView("roi")} style={{ padding: "7px 12px", borderRadius: "8px", background: view === "roi" ? "#f59e0b" : "transparent", color: "white", border: "1px solid #444", cursor: "pointer", fontSize: "12px" }}>💰 ROI Calculator</button>
          <button onClick={() => setDarkMode(!darkMode)} style={{ padding: "7px 12px", borderRadius: "8px", background: "#1e1e3f", color: darkMode ? "#fcd34d" : "#818cf8", border: "1px solid #444", cursor: "pointer", fontSize: isMobile ? "12px" : "13px" }}>{darkMode ? "☀️ Light" : "🌙 Dark"}</button>
          <button onClick={() => setView("gaps")} style={{ padding: "7px 12px", borderRadius: "8px", background: view === "gaps" ? "#a855f7" : "rgba(255,255,255,0.1)", color: "#fff", border: "none", cursor: "pointer", fontSize: "12px" }}>🔍 Gap Finder</button>
          <button onClick={() => setHistoryView(!historyView)} style={{ padding: "7px 12px", borderRadius: "8px", background: historyView ? "#1a1a2e" : "#1e1e3f", color: "#f59e0b", border: "1px solid #92400e", cursor: "pointer", fontSize: isMobile ? "12px" : "13px" }}>📜 History</button>
          {comparedGuests.length >= 2 && <button onClick={() => setView("compare")} style={{ padding: "7px 12px", borderRadius: "8px", background: "linear-gradient(135deg,#4c1d95,#1e3a5f)", color: "#c4b5fd", border: "1px solid #7c3aed", cursor: "pointer", fontSize: isMobile ? "12px" : "13px", fontWeight: "bold" }}>⚖️ Compare ({comparedGuests.length})</button>}
          {user?.email === "chaurasiyavikas1234@gmail.com" && <button onClick={() => setView("admin")} style={{ padding: "7px 12px", borderRadius: "8px", background: view === "admin" ? "#6366f1" : "#1e1e3f", color: "#fff", border: "1px solid #6366f1", cursor: "pointer" }}>🛡️ Admin</button>}
          <button onClick={() => generateGuests()} disabled={loading} style={{ padding: "8px 14px", borderRadius: "8px", background: loading ? "#333" : "linear-gradient(135deg,#7c3aed,#2563eb)", color: "#fff", border: "none", cursor: loading ? "not-allowed" : "pointer", fontSize: isMobile ? "12px" : "13px", fontWeight: "bold" }}>{loading ? "⏳ Loading..." : "🔄 Refresh"}</button>
        </div>
      </div>

      {/* Category Bar */}
      {view === "home" && (
        <div style={{ background: "#0d0d1a", borderBottom: "1px solid #222", padding: "10px 16px", overflowX: "auto" }}>
          <div style={{ display: "flex", gap: "6px", minWidth: "max-content" }}>
            {CATEGORIES.map(cat => (
              <button key={cat.id} onClick={() => generateCategoryGuests(cat)}
                style={{ padding: "7px 14px", borderRadius: "20px", border: `1px solid ${activeCategory === cat.id ? cat.color : "#333"}`, background: activeCategory === cat.id ? cat.color + "22" : "#111", color: activeCategory === cat.id ? cat.color : "#888", cursor: "pointer", fontSize: "12px", fontWeight: activeCategory === cat.id ? "bold" : "normal", whiteSpace: "nowrap", transition: "all 0.2s" }}>
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      )}
{view === "admin" && user?.email === "chaurasiyavikas1234@gmail.com" && (
  <div>
    <div style={{ padding: "24px", maxWidth: "900px", margin: "0 auto" }}>
      <h2 style={{ color: "#a78bfa", marginBottom: "24px" }}>🔐 Access Management</h2>
      <div style={{ background: "#111827", borderRadius: "12px", padding: "20px", marginBottom: "24px", border: "1px solid #1f2937" }}>
        <h3 style={{ color: "#4ade80", marginBottom: "16px" }}>➕ Pre-Approve a Member</h3>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <input placeholder="Email address" value={preApproveEmail} onChange={e => setPreApproveEmail(e.target.value)}
            style={{ flex: 1, minWidth: "200px", padding: "10px 14px", borderRadius: "8px", background: "#1f2937", color: "#fff", border: "1px solid #374151", fontSize: "13px" }} />
          <select value={preApproveRole} onChange={e => setPreApproveRole(e.target.value)}
            style={{ padding: "10px 14px", borderRadius: "8px", background: "#1f2937", color: "#fff", border: "1px solid #374151", fontSize: "13px" }}>
            <option>Admin</option><option>Lead Producer</option><option>Researcher</option><option>Outreach</option><option>Viewer</option>
          </select>
          <button onClick={handlePreApprove}
            style={{ padding: "10px 20px", borderRadius: "8px", background: "linear-gradient(135deg,#22c55e,#16a34a)", color: "#fff", border: "none", cursor: "pointer", fontWeight: "bold" }}>
            ✅ Pre-Approve
          </button>
        </div>
      </div>
    <div style={{ background: "#111827", borderRadius: "12px", padding: "20px", marginBottom: "24px", border: "1px solid #1f2937" }}>
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
    <h3 style={{ color: "#22c55e", margin: 0 }}>👥 Active Members ({pendingRequests.filter(r => r.status === "approved").length})</h3>
    <button onClick={fetchPendingRequests} style={{ padding: "6px 14px", borderRadius: "8px", background: "#1f2937", color: "#9ca3af", border: "1px solid #374151", cursor: "pointer", fontSize: "12px" }}>🔄 Refresh</button>
  </div>
  {pendingRequests.filter(r => r.status === "approved").length === 0 ? (
    <p style={{ color: "#555", textAlign: "center", padding: "20px" }}>No active members yet.</p>
  ) : (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {pendingRequests.filter(r => r.status === "approved").map((req, i) => (
        <div key={i} style={{ background: "#0d1117", borderRadius: "10px", padding: "14px 16px", border: "1px solid #166534", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {req.avatar_url && <img src={req.avatar_url} style={{ width: "36px", height: "36px", borderRadius: "50%", border: "2px solid #22c55e" }} />}
            <div>
              <p style={{ margin: "0 0 4px", color: "#fff", fontWeight: "bold" }}>{req.name || req.email}</p>
              <p style={{ margin: "0 0 4px", color: "#64748b", fontSize: "12px" }}>{req.email}</p>
              <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "10px", background: "#1e3a5f", color: "#60a5fa" }}>
                {req.role || "Viewer"}
              </span>
            </div>
          </div>
          <button onClick={() => handleRemoveUser(req.email)}
            style={{ padding: "7px 16px", borderRadius: "8px", background: "#7f1d1d", color: "#f87171", border: "1px solid #991b1b", cursor: "pointer", fontWeight: "bold", fontSize: "13px" }}>
            🗑️ Remove
          </button>
        </div>
      ))}
    </div>
  )}
</div>  
      <div style={{ background: "#111827", borderRadius: "12px", padding: "20px", border: "1px solid #1f2937" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h3 style={{ color: "#f59e0b", margin: 0 }}>📋 All Access Requests</h3>
          <button onClick={fetchPendingRequests} style={{ padding: "6px 14px", borderRadius: "8px", background: "#1f2937", color: "#9ca3af", border: "1px solid #374151", cursor: "pointer", fontSize: "12px" }}>🔄 Refresh</button>
        </div>
        {pendingRequests.length === 0 ? (
          <p style={{ color: "#555", textAlign: "center", padding: "20px" }}>No requests yet.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {pendingRequests.map((req, i) => (
              <div key={i} style={{ background: "#0d1117", borderRadius: "10px", padding: "14px 16px", border: `1px solid ${req.status === "approved" ? "#166534" : req.status === "rejected" ? "#7f1d1d" : "#92400e"}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                <div>
                  <p style={{ margin: "0 0 4px", color: "#fff", fontWeight: "bold" }}>{req.name || req.email}</p>
                  <p style={{ margin: "0 0 4px", color: "#64748b", fontSize: "12px" }}>{req.email}</p>
                  <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "10px", background: req.status === "approved" ? "#14532d" : req.status === "rejected" ? "#7f1d1d" : "#78350f", color: req.status === "approved" ? "#4ade80" : req.status === "rejected" ? "#f87171" : "#fbbf24" }}>
                    {req.status === "approved" ? `✅ Approved — ${req.role}` : req.status === "rejected" ? "❌ Rejected" : "⏳ Pending"}
                    </span>
              </div>
              {req.status === "approved" && (
                <button onClick={() => handleRemoveUser(req.email)}
                  style={{ padding: "7px 16px", borderRadius: "8px", background: "#7f1d1d", color: "#f87171", border: "1px solid #991b1b", cursor: "pointer", fontWeight: "bold", fontSize: "13px" }}>
                  🗑️ Remove Access
                </button>
              )}

                {req.status === "pending" && (
                  <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                    <select defaultValue="Researcher" id={`role-${i}`}
                      style={{ padding: "7px 10px", borderRadius: "8px", background: "#1f2937", color: "#fff", border: "1px solid #374151", fontSize: "12px" }}>
                      <option>Admin</option><option>Lead Producer</option><option>Researcher</option><option>Outreach</option><option>Viewer</option>
                    </select>
                    <button onClick={() => handleApproveUser(req.email, document.getElementById(`role-${i}`).value)}
                      style={{ padding: "7px 16px", borderRadius: "8px", background: "#14532d", color: "#4ade80", border: "1px solid #166534", cursor: "pointer", fontWeight: "bold", fontSize: "13px" }}>✅ Approve</button>
                    <button onClick={() => handleRejectUser(req.email)}
                      style={{ padding: "7px 16px", borderRadius: "8px", background: "#7f1d1d", color: "#f87171", border: "1px solid #991b1b", cursor: "pointer", fontWeight: "bold", fontSize: "13px" }}>❌ Reject</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    <AdminDashboard />
  </div>
)}
      <div style={{ padding: isMobile ? "14px" : "24px", maxWidth: "1300px", margin: "0 auto" }}>

        {/* Search & Filter Bar */}
        <div style={{ background: "#080810", borderBottom: "1px solid #1f2937", padding: "8px 0px", display: "flex", gap: "8px", alignItems: "center", flexWrap: isMobile ? "wrap" : "nowrap", marginBottom: "16px" }}>
          <div style={{ flex: 2, minWidth: "160px", display: "flex", gap: "6px", alignItems: "center", background: "#111827", borderRadius: "8px", padding: "7px 12px", border: "1px solid #374151" }}>
            <span style={{ fontSize: "14px" }}>🔍</span>
            <input placeholder="Global Search — any guest name..." value={globalSearch} onChange={e => setGlobalSearch(e.target.value)} onKeyDown={e => e.key === "Enter" && runGlobalSearch()}
              style={{ flex: 1, background: "transparent", border: "none", color: "#fff", fontSize: "12px", outline: "none" }} />
            {globalSearch && <span onClick={() => { setGlobalSearch(""); setGlobalSearchResult(null) }} style={{ cursor: "pointer", color: "#6b7280", fontSize: "16px" }}>×</span>}
          </div>
          <button onClick={runGlobalSearch} disabled={loadingGlobalSearch || !globalSearch.trim()}
            style={{ padding: "7px 14px", borderRadius: "8px", background: globalSearch.trim() ? "linear-gradient(135deg,#7c3aed,#2563eb)" : "#1f2937", color: globalSearch.trim() ? "#fff" : "#4b5563", border: "none", cursor: globalSearch.trim() ? "pointer" : "not-allowed", fontSize: "12px", fontWeight: "bold", whiteSpace: "nowrap" }}>
            {loadingGlobalSearch ? "..." : "Search"}
          </button>
          <div style={{ width: "1px", height: "24px", background: "#1f2937", flexShrink: 0 }} />
          <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)}
            style={{ padding: "7px 10px", borderRadius: "8px", background: "#111827", color: filterPriority === "High" ? "#00ff88" : filterPriority === "Medium" ? "#ffaa00" : filterPriority === "Low" ? "#ff6666" : "#9ca3af", border: "1px solid #374151", fontSize: "12px", cursor: "pointer", flexShrink: 0 }}>
            <option value="All">All Priority</option><option value="High">High</option><option value="Medium">Medium</option><option value="Low">Low</option>
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            style={{ padding: "7px 10px", borderRadius: "8px", background: "#111827", color: "#9ca3af", border: "1px solid #374151", fontSize: "12px", cursor: "pointer", flexShrink: 0 }}>
            <option value="All">All Status</option><option value="New">New</option><option value="Contacted">Contacted</option><option value="Booked">Booked</option><option value="Declined">Declined</option>
          </select>
          {(filterPriority !== "All" || filterStatus !== "All") && (
            <button onClick={() => { setFilterPriority("All"); setFilterStatus("All") }}
              style={{ padding: "7px 10px", borderRadius: "8px", background: "#2a1a1a", color: "#f87171", border: "1px solid #7f1d1d", cursor: "pointer", fontSize: "12px", flexShrink: 0 }}>Clear</button>
          )}
          <button onClick={exportGuestsToCSV} style={{ padding: "7px 12px", borderRadius: "8px", background: "#1a2e1a", color: "#4ade80", border: "1px solid #166534", cursor: "pointer", fontSize: "12px", fontWeight: "bold", whiteSpace: "nowrap", flexShrink: 0 }}>Export CSV</button>
        </div>

        {/* Global Search Result */}
        {globalSearchResult && (
          <div style={{ background: "#0d0d1a", borderRadius: "12px", padding: "20px", marginBottom: "16px", border: "1px solid #1f2937" }}>
            <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap", alignItems: "center" }}>
              <h3 style={{ margin: 0, color: "#fff", fontSize: "18px" }}>{globalSearchResult.fullName}</h3>
              <span style={{ fontSize: "12px", background: "#1e1e3f", color: "#a78bfa", padding: "2px 10px", borderRadius: "20px" }}>{globalSearchResult.category}</span>
              {globalSearchResult.inPastGuests && <span style={{ fontSize: "11px", background: "#14532d", color: "#4ade80", padding: "2px 10px", borderRadius: "20px", fontWeight: "bold" }}>✅ Already on Show</span>}
              {!globalSearchResult.inPastGuests && <span style={{ fontSize: "11px", background: "#1e3a5f", color: "#60a5fa", padding: "2px 10px", borderRadius: "20px", fontWeight: "bold" }}>✨ Never on Show</span>}
              {globalSearchResult.inPipeline && <span style={{ fontSize: "11px", background: "#78350f", color: "#fbbf24", padding: "2px 10px", borderRadius: "20px", fontWeight: "bold" }}>📋 In Pipeline — {globalSearchResult.inPipeline.status}</span>}
              {globalSearchResult.inRecent && !globalSearchResult.inPipeline && <span style={{ fontSize: "11px", background: "#2a1a1a", color: "#f87171", padding: "2px 10px", borderRadius: "20px", fontWeight: "bold" }}>⏳ Suggested Recently</span>}
              <span style={{ fontSize: "11px", fontWeight: "bold", padding: "2px 10px", borderRadius: "20px", background: globalSearchResult.recommendation === "BOOK NOW" ? "#14532d" : globalSearchResult.recommendation === "CONSIDER" ? "#78350f" : "#7f1d1d", color: globalSearchResult.recommendation === "BOOK NOW" ? "#4ade80" : globalSearchResult.recommendation === "CONSIDER" ? "#fbbf24" : "#f87171" }}>
                {globalSearchResult.recommendation}
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: "12px", marginBottom: "16px" }}>
              <div style={{ background: "#111827", borderRadius: "10px", padding: "14px", border: "1px solid #1f2937" }}>
                <div style={{ fontSize: "11px", color: "#6b7280", fontWeight: "bold", marginBottom: "8px" }}>PROFILE</div>
                <p style={{ margin: "0 0 6px", fontSize: "13px", color: "#d1d5db", lineHeight: "1.6" }}>{globalSearchResult.background}</p>
                <div style={{ fontSize: "12px", color: "#9ca3af" }}>Age: {globalSearchResult.age}</div>
                <div style={{ fontSize: "12px", color: "#9ca3af" }}>Following: {globalSearchResult.socialFollowing}</div>
                <div style={{ fontSize: "12px", color: "#9ca3af" }}>Net Worth: {globalSearchResult.netWorth}</div>
              </div>
              <div style={{ background: "#111827", borderRadius: "10px", padding: "14px", border: "1px solid #166534" }}>
                <div style={{ fontSize: "11px", color: "#4ade80", fontWeight: "bold", marginBottom: "8px" }}>FOR RAJ'S SHOW</div>
                <div style={{ fontSize: "12px", color: "#f59e0b", marginBottom: "4px" }}>Why Now:</div>
                <p style={{ margin: "0 0 8px", fontSize: "12px", color: "#d1d5db", lineHeight: "1.5" }}>{globalSearchResult.whyNowForRaj}</p>
                <div style={{ fontSize: "12px", color: "#60a5fa", marginBottom: "4px" }}>Best Angle:</div>
                <p style={{ margin: "0 0 8px", fontSize: "12px", color: "#d1d5db", lineHeight: "1.5" }}>{globalSearchResult.bestAngle}</p>
                <div style={{ display: "flex", gap: "8px" }}>
                  <span style={{ fontSize: "11px", background: "#1f2937", padding: "3px 8px", borderRadius: "6px", color: globalSearchResult.audienceMatch >= 8 ? "#00ff88" : "#ffaa00" }}>Audience: {globalSearchResult.audienceMatch}/10</span>
                  <span style={{ fontSize: "11px", background: "#1f2937", padding: "3px 8px", borderRadius: "6px", color: globalSearchResult.viralPotential >= 8 ? "#00ff88" : "#ffaa00" }}>Viral: {globalSearchResult.viralPotential}/10</span>
                </div>
              </div>
              <div style={{ background: "#111827", borderRadius: "10px", padding: "14px", border: "1px solid #1f2937" }}>
                <div style={{ fontSize: "11px", color: "#6b7280", fontWeight: "bold", marginBottom: "8px" }}>KEY ACHIEVEMENTS</div>
                {globalSearchResult.achievements && globalSearchResult.achievements.map((a, ai) => (
                  <div key={ai} style={{ fontSize: "12px", color: "#d1d5db", padding: "3px 0", borderBottom: "1px solid #1f2937", display: "flex", gap: "6px" }}>
                    <span style={{ color: "#4ade80" }}>▸</span> {a}
                  </div>
                ))}
                {globalSearchResult.controversies && globalSearchResult.controversies !== "None" && (
                  <div style={{ marginTop: "8px", padding: "6px 8px", background: "#2a1a1a", borderRadius: "6px", fontSize: "11px", color: "#f87171" }}>⚠️ {globalSearchResult.controversies}</div>
                )}
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <button onClick={() => addToPipeline({ name: globalSearchResult.fullName, category: globalSearchResult.category, whyNow: globalSearchResult.whyNowForRaj, topicAngle: globalSearchResult.bestAngle, virality: globalSearchResult.viralPotential, relevance: globalSearchResult.audienceMatch, value: 8, total: ((globalSearchResult.viralPotential + globalSearchResult.audienceMatch + 8) / 3).toFixed(1), priority: ((globalSearchResult.viralPotential + globalSearchResult.audienceMatch + 8) / 3) >= 8 ? "High" : "Medium", status: "New", lastAppeared: globalSearchResult.inPastGuests ? "Previously" : "Never", isAISlot: false, addedDate: new Date().toLocaleDateString("en-IN") }, "search")}
                style={{ padding: "8px 16px", borderRadius: "8px", background: "#1a2e3f", color: "#38bdf8", border: "1px solid #0369a1", cursor: "pointer", fontSize: "13px", fontWeight: "bold" }}>+ Add to Pipeline</button>
              <button onClick={() => generateResearch({ name: globalSearchResult.fullName, category: globalSearchResult.category })} style={{ padding: "8px 16px", borderRadius: "8px", background: "#1e3a5f", color: "#60a5fa", border: "1px solid #1e40af", cursor: "pointer", fontSize: "13px" }}>📋 Research</button>
              <button onClick={() => generateOutreach({ name: globalSearchResult.fullName, category: globalSearchResult.category, whyNow: globalSearchResult.whyNowForRaj, topicAngle: globalSearchResult.bestAngle })} style={{ padding: "8px 16px", borderRadius: "8px", background: "#1a2e1a", color: "#4ade80", border: "1px solid #166534", cursor: "pointer", fontSize: "13px" }}>✉️ Outreach</button>
              <button onClick={() => generateQuestions({ name: globalSearchResult.fullName, category: globalSearchResult.category })} style={{ padding: "8px 16px", borderRadius: "8px", background: "#2d1a3e", color: "#c084fc", border: "1px solid #6b21a8", cursor: "pointer", fontSize: "13px" }}>❓ Questions</button>
              <button onClick={() => { setSelectedGuest({ name: globalSearchResult.fullName, category: globalSearchResult.category }); generateWhatsapp({ name: globalSearchResult.fullName, category: globalSearchResult.category }); setView("whatsapp") }} style={{ padding: "8px 16px", borderRadius: "8px", background: "#1a2e1a", color: "#25d366", border: "1px solid #128c7e", cursor: "pointer", fontSize: "13px" }}>💬 WhatsApp</button>
              <button onClick={() => generateBrief({ name: globalSearchResult.fullName, category: globalSearchResult.category })} style={{ padding: "8px 16px", borderRadius: "8px", background: "#1a1a0a", color: "#fbbf24", border: "1px solid #92400e", cursor: "pointer", fontSize: "13px" }}>📄 Brief</button>
              <button onClick={() => setGlobalSearchResult(null)} style={{ padding: "8px 16px", borderRadius: "8px", background: "#2a1a1a", color: "#f87171", border: "1px solid #7f1d1d", cursor: "pointer", fontSize: "13px" }}>✕ Close</button>
            </div>
          </div>
        )}

        {/* HOME VIEW */}
        {view === "home" && (
          <div>
            {guests.length > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
                <div>
                  <h2 style={{ margin: "0 0 4px", color: "#a78bfa", fontSize: isMobile ? "16px" : "20px" }}>{activeCategory === "all" ? "Today's Guest Recommendations" : `${CATEGORIES.find(c => c.id === activeCategory)?.label} — Top 5`}</h2>
                  <p style={{ margin: 0, fontSize: "12px", color: "#555" }}>{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <div style={{ display: "flex", gap: "10px", fontSize: "12px", color: "#666", flexWrap: "wrap" }}>
                  <span>🟢 {guests.filter(g => g.priority === "High").length} High</span>
                  <span>🟡 {guests.filter(g => g.priority === "Medium").length} Medium</span>
                  {pipeline.length > 0 && <span style={{ color: "#38bdf8" }}>📋 {pipeline.length} Pipeline</span>}
                </div>
              </div>
            )}
            {loadingCategory && <div style={{ textAlign: "center", padding: "60px", color: "#666", fontSize: "16px" }}>Finding exclusive voices in this category...</div>}
            {!loadingCategory && guests.length === 0 && activeCategory === "all" && (
              <div style={{ textAlign: "center", padding: isMobile ? "40px 16px" : "80px 20px" }}>
                <div style={{ fontSize: "60px", marginBottom: "20px" }}>🎯</div>
                <h2 style={{ fontSize: isMobile ? "20px" : "24px", color: "#a78bfa" }}>Welcome to Guest Intelligence System</h2>
                <p style={{ color: "#666", marginBottom: "8px", fontSize: "14px" }}>500+ past guests tracked • 15 fresh daily suggestions • ☁️ Cloud Synced</p>
                <p style={{ color: "#34d399", marginBottom: "4px", fontSize: "13px", fontStyle: "italic" }}>"Stop chasing famous names, find exclusive voices no one else has"</p>
                <p style={{ color: "#555", marginBottom: "30px", fontSize: "11px" }}>— Raj Shamani's philosophy</p>
                <button onClick={() => generateGuests()} style={{ padding: "14px 32px", borderRadius: "12px", background: "linear-gradient(135deg,#7c3aed,#2563eb)", color: "#fff", border: "none", cursor: "pointer", fontSize: "16px", fontWeight: "bold" }}>🚀 Generate Guest List</button>
              </div>
            )}
            {!loadingCategory && filteredDisplayGuests.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill,minmax(340px,1fr))", gap: "14px" }}>
                {filteredDisplayGuests.map((g, i) => <GuestCard key={i} g={g} i={i} source={activeCategory === "all" ? "main" : "category"} showAddToPipeline={activeCategory !== "all"} />)}
              </div>
            )}
          </div>
        )}

        {/* TRENDING VIEW */}
        {view === "trending" && (
<div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
  <h2 style={{ color: "#fb923c", marginBottom: "8px" }}>🔥 Trend Intelligence Engine</h2>
  <p style={{ color: "#888", marginBottom: "24px" }}>Real-time trend analysis — momentum, opportunity, guest fit, and sponsor match.</p>
  <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap", alignItems: "center" }}>
    <button onClick={fetchTrends} disabled={loadingTrends} style={{ padding: "10px 24px", borderRadius: "8px", background: "#fb923c", color: "#000", border: "none", cursor: "pointer", fontWeight: "bold" }}>
      {loadingTrends ? "⏳ Fetching..." : "🔥 Refresh Trends"}
    </button>
    {trends.length > 0 && (
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {[["All", "all"], ["India 🇮🇳", "India"], ["Global 🌍", "International"]].map(([label, val]) => (
          <button key={val} onClick={() => setActiveCategory(val)} style={{ padding: "6px 14px", borderRadius: "20px", background: activeCategory === val ? "#fb923c" : "#1a1a2e", color: activeCategory === val ? "#000" : "#ccc", border: `1px solid ${activeCategory === val ? "#fb923c" : "#333"}`, cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}>{label}</button>
        ))}
      </div>
    )}
    {trends.length > 0 && (
      <div style={{ display: "flex", gap: "12px", marginLeft: "auto" }}>
        <div style={{ background: "#1a1a2e", padding: "6px 12px", borderRadius: "8px", fontSize: "12px" }}>
          <span style={{ color: "#888" }}>Trends: </span><span style={{ color: "#fb923c", fontWeight: "bold" }}>{trends.length}</span>
        </div>
        <div style={{ background: "#1a1a2e", padding: "6px 12px", borderRadius: "8px", fontSize: "12px" }}>
          <span style={{ color: "#888" }}>High Opportunity: </span><span style={{ color: "#22c55e", fontWeight: "bold" }}>{trends.filter(t => t.opportunityScore >= 8).length}</span>
        </div>
        <div style={{ background: "#1a1a2e", padding: "6px 12px", borderRadius: "8px", fontSize: "12px" }}>
          <span style={{ color: "#888" }}>First Mover: </span><span style={{ color: "#f59e0b", fontWeight: "bold" }}>{trends.filter(t => t.firstMoverAlert).length}</span>
        </div>
      </div>
    )}
  </div>
  {loadingTrends && <div style={{ textAlign: "center", padding: "60px", color: "#fb923c" }}><div style={{ fontSize: "48px", marginBottom: "16px" }}>🔥</div><p>Analyzing trends...</p></div>}
  {!loadingTrends && trends.length === 0 && (
    <div style={{ textAlign: "center", padding: "60px", background: "#1a1a2e", borderRadius: "12px", color: "#555" }}>
      <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔥</div>
      <p>Click Refresh Trends to load intelligence</p>
    </div>
  )}
  {trends.length > 0 && (
    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(340px, 1fr))", gap: "16px" }}>
      {trends.filter(t => activeCategory === "all" || t.scope === activeCategory).map((trend, ti) => (
        <div key={ti} style={{ background: "#1a1a2e", borderRadius: "12px", border: `1px solid ${trend.opportunityScore >= 8 ? "#fb923c" : trend.opportunityScore >= 6 ? "#f59e0b" : "#333"}44`, overflow: "hidden" }}>
          <div style={{ padding: "16px", background: "#0d0d1a" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "6px" }}>
                  <span style={{ background: trend.scope === "India" ? "#7c2d1220" : "#1e1b4b", color: trend.scope === "India" ? "#fb923c" : "#818cf8", padding: "2px 8px", borderRadius: "10px", fontSize: "10px", fontWeight: "bold" }}>{trend.scope === "India" ? "🇮🇳" : "🌍"} {trend.scope}</span>
                  <span style={{ background: "#1e1e3f", color: "#a78bfa", padding: "2px 8px", borderRadius: "10px", fontSize: "10px" }}>{trend.category}</span>
                  {trend.firstMoverAlert && <span style={{ background: "#f59e0b20", color: "#f59e0b", padding: "2px 8px", borderRadius: "10px", fontSize: "10px", fontWeight: "bold" }}>⚡ First Mover</span>}
                </div>
                <h3 style={{ color: "#fff", margin: 0, fontSize: "14px", lineHeight: "1.4" }}>{trend.topic}</h3>
              </div>
              <div style={{ textAlign: "center", minWidth: "50px" }}>
                <div style={{ fontSize: "24px", fontWeight: "bold", color: trend.opportunityScore >= 8 ? "#fb923c" : trend.opportunityScore >= 6 ? "#f59e0b" : "#888" }}>{trend.opportunityScore}</div>
                <div style={{ fontSize: "9px", color: "#666" }}>OPPORTUNITY</div>
              </div>
            </div>
            <p style={{ color: "#888", fontSize: "12px", marginBottom: "10px", lineHeight: "1.4" }}>{trend.headline}</p>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "10px" }}>
              <span style={{ fontSize: "11px", color: trend.momentumDirection === "Rising" ? "#22c55e" : trend.momentumDirection === "Declining" ? "#ef4444" : "#f59e0b" }}>{trend.momentumDirection === "Rising" ? "↑" : trend.momentumDirection === "Declining" ? "↓" : "→"} {trend.momentumDirection}</span>
              <span style={{ fontSize: "11px", color: "#888" }}>• {trend.longevity}</span>
              <span style={{ fontSize: "11px", color: trend.peakWindow === "Act Now" ? "#ef4444" : trend.peakWindow === "2-4 Weeks" ? "#f59e0b" : "#888" }}>• ⏰ {trend.peakWindow}</span>
              <span style={{ fontSize: "11px", color: trend.saturationWarning === "High" ? "#ef4444" : trend.saturationWarning === "Medium" ? "#f59e0b" : "#22c55e" }}>• Saturation: {trend.saturationWarning}</span>
            </div>
            <div style={{ background: "#ffffff08", borderRadius: "8px", padding: "10px", marginBottom: "10px" }}>
              <p style={{ color: "#a78bfa", fontSize: "11px", marginBottom: "4px", fontWeight: "bold" }}>🎯 Suggested Guest: <span style={{ color: "#fff" }}>{trend.suggestedGuest}</span></p>
              <p style={{ color: "#888", fontSize: "11px", marginBottom: "4px" }}>🎙️ {trend.episodeAngle}</p>
              <p style={{ color: "#888", fontSize: "11px", marginBottom: "4px" }}>💰 Sponsor: {trend.sponsorFit}</p>
              <p style={{ color: "#fb923c", fontSize: "11px" }}>🪝 Hook: {trend.hook}</p>
            </div>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              <button onClick={() => findGuestForTrend(trend)} style={{ flex: 1, padding: "7px", borderRadius: "7px", background: "#1a2e1a", color: "#4ade80", border: "1px solid #166534", cursor: "pointer", fontSize: "11px", fontWeight: "bold" }}>🎯 Find Guest</button>
              <button onClick={() => setCalendarEpisodes(prev => [...prev, { guest: trend.suggestedGuest, topic: trend.topic, category: trend.category, recordDate: "", publishDate: "", status: "Booked", priority: trend.opportunityScore >= 8 ? "High" : "Medium", sponsor: trend.sponsorFit, owner: "", notes: trend.episodeAngle, id: Date.now() }])} style={{ flex: 1, padding: "7px", borderRadius: "7px", background: "#1a1a2e", color: "#fb923c", border: "1px solid #fb923c44", cursor: "pointer", fontSize: "11px" }}>📅 Add to Calendar</button>
            </div>
            {trendGuests[trend.topic] && (() => {
              const g = trendGuests[trend.topic]
              return (
                <div style={{ marginTop: "10px", background: "#0d1117", borderRadius: "8px", padding: "12px", border: "1px solid #22c55e44" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                    <span style={{ color: "#fff", fontWeight: "bold", fontSize: "13px" }}>{g.name}</span>
                    <span style={{ color: "#22c55e", fontWeight: "bold" }}>{g.total}</span>
                  </div>
                  <p style={{ color: "#888", fontSize: "11px", margin: "0 0 8px" }}>{g.whyNow}</p>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button onClick={() => addToPipeline(g, "trending")} style={{ flex: 1, padding: "6px", borderRadius: "6px", background: "#1a2e3f", color: "#38bdf8", border: "1px solid #0369a1", cursor: "pointer", fontSize: "11px" }}>+ Pipeline</button>
                    <button onClick={() => generateOutreach(g)} style={{ flex: 1, padding: "6px", borderRadius: "6px", background: "#1a2e1a", color: "#4ade80", border: "1px solid #166534", cursor: "pointer", fontSize: "11px" }}>Outreach</button>
                  </div>
                </div>
              )
            })()}
          </div>
        </div>
      ))}
    </div>
  )}
</div>
)}
        {/* SENTIMENT ANALYZER VIEW */}
        {view === "sentiment" && (
<div style={{ padding: "24px", maxWidth: "1100px", margin: "0 auto" }}>
  <h2 style={{ color: "#34d399", marginBottom: "8px" }}>🧠 Reputation Intelligence System</h2>
  <p style={{ color: "#888", marginBottom: "24px" }}>Deep public perception analysis — sentiment, risk, brand safety, and content strategy.</p>
  <div style={{ background: "#1a1a2e", border: "1px solid #34d39933", borderRadius: "12px", padding: "24px", marginBottom: "24px" }}>
    <h3 style={{ color: "#34d399", marginBottom: "16px" }}>⚙️ Analysis Setup</h3>
    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: "16px" }}>
      <div>
        <label style={{ color: "#ccc", fontSize: "13px", display: "block", marginBottom: "6px" }}>Guest Name *</label>
        <input value={sentimentGuest} onChange={e => setSentimentGuest(e.target.value)} placeholder="e.g. Ashneer Grover" style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", background: "#0d0900", color: "#fff", border: "1px solid #333", boxSizing: "border-box" }} />
      </div>
      <div>
        <label style={{ color: "#ccc", fontSize: "13px", display: "block", marginBottom: "6px" }}>Analysis Focus</label>
        <select value={sentimentFocus} onChange={e => setSentimentFocus(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "#0d0900", color: "#fff", border: "1px solid #333" }}>
          {["Reputation", "Brand Safety", "Content Opportunity"].map(o => <option key={o}>{o}</option>)}
        </select>
      </div>
      <div>
        <label style={{ color: "#ccc", fontSize: "13px", display: "block", marginBottom: "6px" }}>Time Range</label>
        <select value={sentimentTimeRange} onChange={e => setSentimentTimeRange(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "#0d0900", color: "#fff", border: "1px solid #333" }}>
          <option value="7">Last 7 Days</option>
          <option value="30">Last 30 Days</option>
          <option value="90">Last 90 Days</option>
        </select>
      </div>
      <div>
        <label style={{ color: "#ccc", fontSize: "13px", display: "block", marginBottom: "6px" }}>Region</label>
        <select value={sentimentRegion} onChange={e => setSentimentRegion(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "#0d0900", color: "#fff", border: "1px solid #333" }}>
          {["India", "Global", "Both"].map(o => <option key={o}>{o}</option>)}
        </select>
      </div>
      <div>
        <label style={{ color: "#ccc", fontSize: "13px", display: "block", marginBottom: "6px" }}>Audience Type</label>
        <select value={sentimentAudience} onChange={e => setSentimentAudience(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "#0d0900", color: "#fff", border: "1px solid #333" }}>
          {["General", "Business", "Youth", "Political"].map(o => <option key={o}>{o}</option>)}
        </select>
      </div>
      <div>
        <label style={{ color: "#ccc", fontSize: "13px", display: "block", marginBottom: "6px" }}>Platforms</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {["Twitter", "YouTube", "Reddit", "News"].map(p => (
            <label key={p} style={{ display: "flex", alignItems: "center", gap: "4px", color: "#ccc", fontSize: "13px", cursor: "pointer" }}>
              <input type="checkbox" checked={sentimentPlatforms.includes(p)} onChange={() => setSentimentPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p])} />
              {p}
            </label>
          ))}
        </div>
      </div>
    </div>
    <button onClick={analyzeSentiment} disabled={loadingSentiment || !sentimentGuest} style={{ marginTop: "20px", padding: "12px 32px", borderRadius: "8px", background: "#34d399", color: "#000", border: "none", cursor: "pointer", fontWeight: "bold", fontSize: "14px" }}>
      {loadingSentiment ? "🔄 Analyzing..." : "🧠 Analyze Reputation"}
    </button>
  </div>
  {sentimentResult && (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(6, 1fr)", gap: "12px", marginBottom: "20px" }}>
        {[
          ["🏆 Reputation", sentimentResult.reputationScore, "#34d399"],
          ["❤️ Audience Love", sentimentResult.audienceLoveScore, "#f472b6"],
          ["🔒 Brand Safety", sentimentResult.brandSafetyScore, "#60a5fa"],
          ["🤝 Trust", sentimentResult.audienceTrustScore, "#a78bfa"],
          ["⚠️ Controversy", sentimentResult.controversyIntensity, "#f59e0b"],
        ].map(([label, score, color]) => (
          <div key={label} style={{ background: "#1a1a2e", borderRadius: "10px", padding: "14px", textAlign: "center", border: `1px solid ${color}44` }}>
            <div style={{ fontSize: "22px", fontWeight: "bold", color }}>{score}</div>
            <div style={{ color: "#888", fontSize: "11px", marginTop: "4px" }}>{label}</div>
          </div>
        ))}
        <div style={{ background: "#1a1a2e", borderRadius: "10px", padding: "14px", textAlign: "center", border: `1px solid ${sentimentResult.overallVerdict === "Safe" ? "#34d399" : sentimentResult.overallVerdict === "Caution" ? "#f59e0b" : "#ef4444"}44` }}>
          <div style={{ fontSize: "16px", fontWeight: "bold", color: sentimentResult.overallVerdict === "Safe" ? "#34d399" : sentimentResult.overallVerdict === "Caution" ? "#f59e0b" : "#ef4444" }}>{sentimentResult.overallVerdict}</div>
          <div style={{ color: "#888", fontSize: "11px", marginTop: "4px" }}>📊 {sentimentResult.trendDirection}</div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
        <div style={{ background: "#1a1a2e", border: "1px solid #333", borderRadius: "12px", padding: "20px" }}>
          <h4 style={{ color: "#34d399", marginBottom: "16px" }}>📱 Platform Sentiment</h4>
          {sentimentResult.platforms?.filter(p => sentimentPlatforms.includes(p.name)).map((p, i) => (
            <div key={i} style={{ marginBottom: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <span style={{ color: "#ccc", fontSize: "13px" }}>{p.name}</span>
                <span style={{ color: "#888", fontSize: "11px" }}>{p.summary}</span>
              </div>
              <div style={{ display: "flex", borderRadius: "4px", overflow: "hidden", height: "8px" }}>
                <div style={{ width: `${p.positive}%`, background: "#34d399" }} />
                <div style={{ width: `${p.neutral}%`, background: "#555" }} />
                <div style={{ width: `${p.negative}%`, background: "#ef4444" }} />
              </div>
              <div style={{ display: "flex", gap: "12px", marginTop: "3px", fontSize: "11px" }}>
                <span style={{ color: "#34d399" }}>+{p.positive}%</span>
                <span style={{ color: "#555" }}>{p.neutral}% neutral</span>
                <span style={{ color: "#ef4444" }}>-{p.negative}%</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ background: "#1a1a2e", border: "1px solid #333", borderRadius: "12px", padding: "20px" }}>
          <h4 style={{ color: "#34d399", marginBottom: "12px" }}>🎯 Topic Clusters</h4>
          <p style={{ color: "#888", fontSize: "12px", marginBottom: "6px" }}>WHAT FANS PRAISE:</p>
          {sentimentResult.topPraiseThemes?.map((t, i) => <div key={i} style={{ background: "#34d39915", color: "#34d399", padding: "6px 10px", borderRadius: "6px", fontSize: "12px", marginBottom: "6px" }}>✅ {t}</div>)}
          <p style={{ color: "#888", fontSize: "12px", margin: "12px 0 6px" }}>WHAT CRITICS ATTACK:</p>
          {sentimentResult.topCriticismThemes?.map((t, i) => <div key={i} style={{ background: "#ef444415", color: "#ef4444", padding: "6px 10px", borderRadius: "6px", fontSize: "12px", marginBottom: "6px" }}>❌ {t}</div>)}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
        <div style={{ background: "#1a1a2e", border: "1px solid #333", borderRadius: "12px", padding: "20px" }}>
          <h4 style={{ color: "#34d399", marginBottom: "12px" }}>🚨 Risk & Opportunity Alerts</h4>
          {sentimentResult.redFlags?.map((f, i) => <div key={i} style={{ background: "#ef444415", color: "#ef4444", padding: "8px 12px", borderRadius: "6px", fontSize: "12px", marginBottom: "8px" }}>🔴 {f}</div>)}
          {sentimentResult.greenOpportunities?.map((o, i) => <div key={i} style={{ background: "#34d39915", color: "#34d399", padding: "8px 12px", borderRadius: "6px", fontSize: "12px", marginBottom: "8px" }}>🟢 {o}</div>)}
          <div style={{ marginTop: "12px", padding: "10px", background: "#f59e0b15", borderRadius: "8px" }}>
            <span style={{ color: "#f59e0b", fontSize: "12px" }}>⚠️ Backlash Probability: <strong>{sentimentResult.backlashProbability}</strong></span>
          </div>
          <div style={{ marginTop: "8px", padding: "10px", background: "#60a5fa15", borderRadius: "8px" }}>
            <span style={{ color: "#60a5fa", fontSize: "12px" }}>🚨 Crisis Indicator: <strong>{sentimentResult.crisisIndicator}</strong></span>
          </div>
        </div>
        <div style={{ background: "#1a1a2e", border: "1px solid #333", borderRadius: "12px", padding: "20px" }}>
          <h4 style={{ color: "#34d399", marginBottom: "12px" }}>👥 Audience Segments</h4>
          {sentimentResult.audienceSegments?.map((s, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px", background: "#ffffff08", borderRadius: "6px", marginBottom: "8px" }}>
              <span style={{ color: "#ccc", fontSize: "13px" }}>{s.segment}</span>
              <div style={{ textAlign: "right" }}>
                <span style={{ color: s.sentiment === "Positive" ? "#34d399" : s.sentiment === "Negative" ? "#ef4444" : "#f59e0b", fontSize: "12px", fontWeight: "bold" }}>{s.sentiment}</span>
                <p style={{ color: "#666", fontSize: "11px", margin: 0 }}>{s.reason}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
        <div style={{ background: "#1a1a2e", border: "1px solid #34d399", borderRadius: "12px", padding: "20px" }}>
          <h4 style={{ color: "#34d399", marginBottom: "12px" }}>🎙️ Content Strategy</h4>
          <p style={{ color: "#888", fontSize: "12px", marginBottom: "4px" }}>SUGGESTED ANGLE:</p>
          <p style={{ color: "#ccc", fontSize: "13px", marginBottom: "12px" }}>{sentimentResult.suggestedInterviewAngle}</p>
          <p style={{ color: "#888", fontSize: "12px", marginBottom: "4px" }}>BEST FRAMING:</p>
          <p style={{ color: "#ccc", fontSize: "13px", marginBottom: "12px" }}>{sentimentResult.bestFraming}</p>
          <p style={{ color: "#888", fontSize: "12px", marginBottom: "4px" }}>RISK MITIGATION:</p>
          <p style={{ color: "#f59e0b", fontSize: "13px" }}>{sentimentResult.riskMitigation}</p>
        </div>
        <div style={{ background: "#1a1a2e", border: "1px solid #333", borderRadius: "12px", padding: "20px" }}>
          <h4 style={{ color: "#34d399", marginBottom: "12px" }}>💰 Sponsor Safety</h4>
          <p style={{ color: "#ccc", fontSize: "13px", marginBottom: "16px" }}>{sentimentResult.sponsorSafetyNote}</p>
          <div style={{ background: `${sentimentResult.rajRecommendation === "BOOK NOW" ? "#34d399" : sentimentResult.rajRecommendation === "BOOK WITH CAUTION" ? "#f59e0b" : sentimentResult.rajRecommendation === "WAIT" ? "#60a5fa" : "#ef4444"}20`, border: `1px solid ${sentimentResult.rajRecommendation === "BOOK NOW" ? "#34d399" : sentimentResult.rajRecommendation === "BOOK WITH CAUTION" ? "#f59e0b" : sentimentResult.rajRecommendation === "WAIT" ? "#60a5fa" : "#ef4444"}`, borderRadius: "10px", padding: "16px" }}>
            <div style={{ fontSize: "16px", fontWeight: "bold", color: sentimentResult.rajRecommendation === "BOOK NOW" ? "#34d399" : sentimentResult.rajRecommendation === "BOOK WITH CAUTION" ? "#f59e0b" : sentimentResult.rajRecommendation === "WAIT" ? "#60a5fa" : "#ef4444", marginBottom: "8px" }}>{sentimentResult.rajRecommendation}</div>
            <p style={{ color: "#ccc", fontSize: "13px", margin: 0 }}>{sentimentResult.rajRecommendationReason}</p>
          </div>
        </div>
      </div>
      <button onClick={() => { setSentimentGuest(""); setSentimentResult(null) }} style={{ padding: "10px 20px", borderRadius: "8px", background: "#333", color: "#fff", border: "none", cursor: "pointer" }}>🔄 New Analysis</button>
    </div>
  )}
</div>
)}
        {/* AVAILABILITY PREDICTOR VIEW */}
        {view === "availability" && (
<div style={{ padding: "24px", maxWidth: "1100px", margin: "0 auto" }}>
  <h2 style={{ color: "#fcd34d", marginBottom: "8px" }}>📅 Guest Availability Predictor V2</h2>
  <p style={{ color: "#888", marginBottom: "24px" }}>Enterprise booking strategy engine — know when, how, and who to contact.</p>
  <div style={{ background: "#1a1a2e", border: "1px solid #fcd34d33", borderRadius: "12px", padding: "24px", marginBottom: "24px" }}>
    <h3 style={{ color: "#fcd34d", marginBottom: "16px" }}>⚙️ Guest Details</h3>
    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: "16px" }}>
      <div>
        <label style={{ color: "#ccc", fontSize: "13px", display: "block", marginBottom: "6px" }}>Guest Name *</label>
        <input value={availabilityGuest} onChange={e => setAvailabilityGuest(e.target.value)} placeholder="e.g. Deepinder Goyal" style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", background: "#0d0900", color: "#fff", border: "1px solid #333", boxSizing: "border-box" }} />
      </div>
      <div>
        <label style={{ color: "#ccc", fontSize: "13px", display: "block", marginBottom: "6px" }}>Guest Category</label>
        <select value={availabilityCategory} onChange={e => setAvailabilityCategory(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "#0d0900", color: "#fff", border: "1px solid #333" }}>
          {["Founder", "Investor", "Celebrity", "Politician", "Author", "Domain Expert", "Athlete", "Artist"].map(o => <option key={o}>{o}</option>)}
        </select>
      </div>
      <div>
        <label style={{ color: "#ccc", fontSize: "13px", display: "block", marginBottom: "6px" }}>Region / Timezone</label>
        <select value={availabilityRegion} onChange={e => setAvailabilityRegion(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "#0d0900", color: "#fff", border: "1px solid #333" }}>
          {["India (IST)", "USA (EST)", "USA (PST)", "UK (GMT)", "UAE (GST)", "Singapore (SGT)", "Europe (CET)"].map(o => <option key={o}>{o}</option>)}
        </select>
      </div>
      <div>
        <label style={{ color: "#ccc", fontSize: "13px", display: "block", marginBottom: "6px" }}>Priority Level</label>
        <select value={availabilityPriority} onChange={e => setAvailabilityPriority(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "#0d0900", color: "#fff", border: "1px solid #333" }}>
          {["High", "Medium", "Low"].map(o => <option key={o}>{o}</option>)}
        </select>
      </div>
      <div>
        <label style={{ color: "#ccc", fontSize: "13px", display: "block", marginBottom: "6px" }}>Purpose</label>
        <select value={availabilityPurpose} onChange={e => setAvailabilityPurpose(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "#0d0900", color: "#fff", border: "1px solid #333" }}>
          {["First Episode", "Repeat Guest", "Collaboration", "Sponsored Episode"].map(o => <option key={o}>{o}</option>)}
        </select>
      </div>
      <div>
        <label style={{ color: "#ccc", fontSize: "13px", display: "block", marginBottom: "6px" }}>Contact Stage</label>
        <select value={availabilityContact} onChange={e => setAvailabilityContact(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "#0d0900", color: "#fff", border: "1px solid #333" }}>
          {["First Contact", "Follow-up", "Re-engagement"].map(o => <option key={o}>{o}</option>)}
        </select>
      </div>
      <div>
        <label style={{ color: "#ccc", fontSize: "13px", display: "block", marginBottom: "6px" }}>Booking Speed</label>
        <select value={availabilitySpeed} onChange={e => setAvailabilitySpeed(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "#0d0900", color: "#fff", border: "1px solid #333" }}>
          {["Fast", "Quality"].map(o => <option key={o}>{o}</option>)}
        </select>
      </div>
      <div>
        <label style={{ color: "#ccc", fontSize: "13px", display: "block", marginBottom: "6px" }}>Warm Intro Available?</label>
        <select value={availabilityWarmIntro} onChange={e => setAvailabilityWarmIntro(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "#0d0900", color: "#fff", border: "1px solid #333" }}>
          {["Yes", "No"].map(o => <option key={o}>{o}</option>)}
        </select>
      </div>
      <div>
        <label style={{ color: "#ccc", fontSize: "13px", display: "block", marginBottom: "6px" }}>Contact Via</label>
        <select value={availabilityContactType} onChange={e => setAvailabilityContactType(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "#0d0900", color: "#fff", border: "1px solid #333" }}>
          {["Direct", "Manager", "PR Agency", "Agent", "Assistant"].map(o => <option key={o}>{o}</option>)}
        </select>
      </div>
    </div>
    <button onClick={predictAvailability} disabled={loadingAvailability || !availabilityGuest} style={{ marginTop: "20px", padding: "12px 32px", borderRadius: "8px", background: "#fcd34d", color: "#000", border: "none", cursor: "pointer", fontWeight: "bold", fontSize: "14px" }}>
      {loadingAvailability ? "🔄 Analyzing..." : "📅 Generate Booking Strategy"}
    </button>
  </div>
  {availabilityResult && (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: "16px", marginBottom: "16px" }}>
        <div style={{ background: "#1a1a2e", border: "1px solid #fcd34d", borderRadius: "12px", padding: "20px", textAlign: "center" }}>
          <div style={{ fontSize: "48px", fontWeight: "bold", color: "#fcd34d" }}>{availabilityResult.bookingProbability}%</div>
          <div style={{ color: "#fcd34d", fontWeight: "bold", marginBottom: "4px" }}>{availabilityResult.bookingProbabilityLabel}</div>
          <div style={{ color: "#888", fontSize: "12px" }}>Confidence Band: {availabilityResult.confidenceBand}</div>
        </div>
        <div style={{ background: "#1a1a2e", border: "1px solid #333", borderRadius: "12px", padding: "20px" }}>
          <h4 style={{ color: "#fcd34d", marginBottom: "12px" }}>📅 Best Outreach Window</h4>
          <p style={{ color: "#ccc", fontSize: "13px", marginBottom: "4px" }}>📆 {availabilityResult.bestMonth}</p>
          <p style={{ color: "#ccc", fontSize: "13px", marginBottom: "4px" }}>📅 {availabilityResult.bestWeek}</p>
          <p style={{ color: "#ccc", fontSize: "13px", marginBottom: "4px" }}>📌 {availabilityResult.bestDay}</p>
          <p style={{ color: "#ccc", fontSize: "13px" }}>⏰ {availabilityResult.bestTime} ({availabilityResult.timezone})</p>
        </div>
        <div style={{ background: "#1a1a2e", border: "1px solid #333", borderRadius: "12px", padding: "20px" }}>
          <h4 style={{ color: "#fcd34d", marginBottom: "12px" }}>📊 Scores</h4>
          {[["Contactability", availabilityResult.contactabilityScore], ["Responsiveness", availabilityResult.responsivenessScore], ["Scheduling Ease", availabilityResult.schedulingEaseScore], ["Relevance", availabilityResult.relevanceScore]].map(([label, score]) => (
            <div key={label} style={{ marginBottom: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#ccc", marginBottom: "3px" }}><span>{label}</span><span>{score}/10</span></div>
              <div style={{ background: "#333", borderRadius: "4px", height: "6px" }}><div style={{ width: `${score * 10}%`, background: "#fcd34d", borderRadius: "4px", height: "6px" }} /></div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
        <div style={{ background: "#1a1a2e", border: "1px solid #333", borderRadius: "12px", padding: "20px" }}>
          <h4 style={{ color: "#fcd34d", marginBottom: "12px" }}>📱 Channel Comparison</h4>
          {availabilityResult.channels?.map((ch, i) => (
            <div key={i} style={{ marginBottom: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: ch.name === availabilityResult.bestChannel ? "#fcd34d" : "#ccc", marginBottom: "3px" }}>
                <span>{ch.name === availabilityResult.bestChannel ? "⭐ " : ""}{ch.name}</span><span>{ch.responseRate}%</span>
              </div>
              <div style={{ background: "#333", borderRadius: "4px", height: "6px" }}><div style={{ width: `${ch.responseRate}%`, background: ch.name === availabilityResult.bestChannel ? "#fcd34d" : "#555", borderRadius: "4px", height: "6px" }} /></div>
              <p style={{ color: "#666", fontSize: "11px", marginTop: "2px" }}>{ch.notes}</p>
            </div>
          ))}
        </div>
        <div style={{ background: "#1a1a2e", border: "1px solid #333", borderRadius: "12px", padding: "20px" }}>
          <h4 style={{ color: "#fcd34d", marginBottom: "12px" }}>🧱 Likely Objections</h4>
          {availabilityResult.objections?.map((o, i) => (
            <div key={i} style={{ marginBottom: "12px", borderBottom: "1px solid #222", paddingBottom: "10px" }}>
              <p style={{ color: "#ef4444", fontSize: "13px", marginBottom: "4px" }}>❌ {o.objection}</p>
              <p style={{ color: "#22c55e", fontSize: "12px" }}>✅ {o.handle}</p>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
        <div style={{ background: "#1a1a2e", border: "1px solid #333", borderRadius: "12px", padding: "20px" }}>
          <h4 style={{ color: "#fcd34d", marginBottom: "12px" }}>💬 Message Strategy</h4>
          <p style={{ color: "#888", fontSize: "12px", marginBottom: "4px" }}>LEAD WITH:</p>
          <p style={{ color: "#ccc", fontSize: "13px", marginBottom: "12px" }}>{availabilityResult.messageAngle}</p>
          <p style={{ color: "#888", fontSize: "12px", marginBottom: "4px" }}>AVOID:</p>
          <p style={{ color: "#ef4444", fontSize: "13px", marginBottom: "12px" }}>{availabilityResult.messageAvoid}</p>
          <p style={{ color: "#888", fontSize: "12px", marginBottom: "4px" }}>CONTACT VIA:</p>
          <p style={{ color: "#ccc", fontSize: "13px" }}>{availabilityResult.contactPerson}</p>
          {availabilityWarmIntro === "Yes" && <p style={{ color: "#22c55e", fontSize: "12px", marginTop: "8px" }}>🤝 {availabilityResult.warmIntroAdvantage}</p>}
        </div>
        <div style={{ background: "#1a1a2e", border: "1px solid #333", borderRadius: "12px", padding: "20px" }}>
          <h4 style={{ color: "#fcd34d", marginBottom: "12px" }}>🔄 Follow-up Sequence</h4>
          {availabilityResult.followUpSequence?.map((step, i) => (
            <div key={i} style={{ display: "flex", gap: "12px", marginBottom: "12px", alignItems: "flex-start" }}>
              <span style={{ background: "#fcd34d20", color: "#fcd34d", padding: "2px 8px", borderRadius: "4px", fontSize: "11px", whiteSpace: "nowrap" }}>{step.day}</span>
              <div>
                <p style={{ color: "#ccc", fontSize: "12px", marginBottom: "2px" }}>{step.action}</p>
                <p style={{ color: "#888", fontSize: "11px" }}>via {step.channel}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: "#1a1a2e", border: "2px solid #fcd34d", borderRadius: "12px", padding: "20px", marginBottom: "16px" }}>
        <h4 style={{ color: "#fcd34d", marginBottom: "8px" }}>🏆 Best Path to Yes</h4>
        <p style={{ color: "#fff", fontSize: "14px", lineHeight: "1.6" }}>{availabilityResult.bestPathToYes}</p>
      </div>
      <div style={{ background: "#1a1a2e", border: "1px solid #333", borderRadius: "12px", padding: "20px", marginBottom: "16px" }}>
        <h4 style={{ color: "#fcd34d", marginBottom: "8px" }}>🧠 Confidence Explanation</h4>
        <p style={{ color: "#ccc", fontSize: "13px", lineHeight: "1.6" }}>{availabilityResult.confidenceExplanation}</p>
      </div>
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <button onClick={() => { setAvailabilityGuest(""); setAvailabilityResult(null) }} style={{ padding: "10px 20px", borderRadius: "8px", background: "#333", color: "#fff", border: "none", cursor: "pointer" }}>🔄 New Prediction</button>
        <button onClick={() => generateOutreach({ name: availabilityGuest, category: availabilityCategory })} style={{ padding: "10px 20px", borderRadius: "8px", background: "#fcd34d", color: "#000", border: "none", cursor: "pointer", fontWeight: "bold" }}>📤 Generate Outreach</button>
      </div>
    </div>
  )}
</div>
)}
{/* SPONSOR MATCHMAKER VIEW */}
{view === "sponsors" && (
  <div style={{ padding: "24px", maxWidth: "900px", margin: "0 auto" }}>
    <h2 style={{ color: "#e879f9", marginBottom: "8px" }}>💰 Sponsor Matchmaker V2</h2>
    <p style={{ color: "#888", marginBottom: "24px" }}>Fill in episode details to get scored, structured sponsor recommendations.</p>

    {/* INPUT FORM */}
    <div style={{ background: "#1a0533", border: "1px solid #7e22ce", borderRadius: "12px", padding: "24px", marginBottom: "24px" }}>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "16px" }}>

        <div>
          <label style={{ color: "#ccc", fontSize: "13px", display: "block", marginBottom: "6px" }}>Guest Name *</label>
          <input value={sponsorGuest} onChange={e => setSponsorGuest(e.target.value)}
            placeholder="e.g. Nikhil Kamath"
            style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", background: "#0d0117", border: "1px solid #4a1572", color: "white", fontSize: "14px", boxSizing: "border-box" }} />
        </div>

        <div>
          <label style={{ color: "#ccc", fontSize: "13px", display: "block", marginBottom: "6px" }}>Guest Type *</label>
          <select value={sponsorGuestType} onChange={e => setSponsorGuestType(e.target.value)}
            style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", background: "#0d0117", border: "1px solid #4a1572", color: "white", fontSize: "14px" }}>
            <option value="">Select guest type</option>
            <option>CEO / Founder</option>
            <option>Creator / Influencer</option>
            <option>Actor / Entertainer</option>
            <option>Cricketer / Athlete</option>
            <option>Politician / Bureaucrat</option>
            <option>Domain Expert</option>
            <option>Investor / VC</option>
          </select>
        </div>

        <div>
          <label style={{ color: "#ccc", fontSize: "13px", display: "block", marginBottom: "6px" }}>Content Theme *</label>
          <select value={sponsorTheme} onChange={e => setSponsorTheme(e.target.value)}
            style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", background: "#0d0117", border: "1px solid #4a1572", color: "white", fontSize: "14px" }}>
            <option value="">Select theme</option>
            <option>Entrepreneurship</option>
            <option>Finance / Investing</option>
            <option>Tech / AI</option>
            <option>Sports / Fitness</option>
            <option>Lifestyle / Self-help</option>
            <option>Politics / Society</option>
            <option>Entertainment</option>
          </select>
        </div>

        <div>
          <label style={{ color: "#ccc", fontSize: "13px", display: "block", marginBottom: "6px" }}>Audience Type *</label>
          <select value={sponsorAudience} onChange={e => setSponsorAudience(e.target.value)}
            style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", background: "#0d0117", border: "1px solid #4a1572", color: "white", fontSize: "14px" }}>
            <option value="">Select audience</option>
            <option>Students / College</option>
            <option>Young Professionals</option>
            <option>Founders / Entrepreneurs</option>
            <option>SMB Owners</option>
            <option>Urban Mass Audience</option>
            <option>Investors / HNI</option>
          </select>
        </div>

        <div>
          <label style={{ color: "#ccc", fontSize: "13px", display: "block", marginBottom: "6px" }}>Sponsor Objective *</label>
          <select value={sponsorObjective} onChange={e => setSponsorObjective(e.target.value)}
            style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", background: "#0d0117", border: "1px solid #4a1572", color: "white", fontSize: "14px" }}>
            <option value="">Select objective</option>
            <option>Brand Awareness</option>
            <option>Lead Generation</option>
            <option>App Installs</option>
            <option>Premium Positioning</option>
            <option>Trust Building</option>
            <option>Product Launch</option>
          </select>
        </div>

        <div>
          <label style={{ color: "#ccc", fontSize: "13px", display: "block", marginBottom: "6px" }}>Budget Tier *</label>
          <select value={sponsorBudgetTier} onChange={e => setSponsorBudgetTier(e.target.value)}
            style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", background: "#0d0117", border: "1px solid #4a1572", color: "white", fontSize: "14px" }}>
            <option value="">Select budget tier</option>
            <option>Low (₹50K–2L)</option>
            <option>Medium (₹2L–8L)</option>
            <option>Premium (₹8L–25L+)</option>
          </select>
        </div>

        <div>
          <label style={{ color: "#ccc", fontSize: "13px", display: "block", marginBottom: "6px" }}>Market *</label>
          <select value={sponsorMarket} onChange={e => setSponsorMarket(e.target.value)}
            style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", background: "#0d0117", border: "1px solid #4a1572", color: "white", fontSize: "14px" }}>
            <option value="">Select market</option>
            <option>India</option>
            <option>Global</option>
            <option>English-speaking</option>
            <option>Regional India</option>
          </select>
        </div>

        <div>
          <label style={{ color: "#ccc", fontSize: "13px", display: "block", marginBottom: "6px" }}>Custom Brands (optional)</label>
          <input value={sponsorCustomBrands} onChange={e => setSponsorCustomBrands(e.target.value)}
            placeholder="e.g. Zerodha, CRED, Razorpay"
            style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", background: "#0d0117", border: "1px solid #4a1572", color: "white", fontSize: "14px", boxSizing: "border-box" }} />
        </div>

      </div>

      <button onClick={matchSponsors} disabled={loadingSponsors}
        style={{ marginTop: "20px", width: "100%", padding: "14px", borderRadius: "8px", background: loadingSponsors ? "#333" : "linear-gradient(135deg,#7e22ce,#e879f9)", color: "white", fontWeight: "bold", fontSize: "16px", border: "none", cursor: "pointer" }}>
        {loadingSponsors ? "🔍 Analyzing sponsors..." : "💰 Find Sponsor Matches"}
      </button>
    </div>

    {/* RESULTS */}
    {sponsorResult && (
      <div>
        <div style={{ background: "#1a0533", border: "1px solid #7e22ce", borderRadius: "12px", padding: "20px", marginBottom: "20px" }}>
          <h3 style={{ color: "#e879f9", margin: "0 0 8px" }}>{sponsorResult.guestName}</h3>
          <p style={{ color: "#ccc", margin: "0 0 12px" }}>{sponsorResult.episodeSummary}</p>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <span style={{ color: "#4ade80", fontWeight: "bold" }}>💰 Total Value: {sponsorResult.totalEpisodeValue}</span>
            <span style={{ color: "#fcd34d" }}>🏆 Best Category: {sponsorResult.bestSponsorCategory}</span>
          </div>
          <p style={{ color: "#aaa", margin: "12px 0 0", fontStyle: "italic" }}>💡 {sponsorResult.strategistNote}</p>
        </div>

        {sponsorResult.sponsors.filter(s => !sponsorExcluded.includes(s.brand)).map((s, i) => (
          <div key={i} style={{ background: "#0d0117", border: "1px solid #4a1572", borderRadius: "12px", padding: "20px", marginBottom: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "8px" }}>
              <div>
                <h4 style={{ color: "#e879f9", margin: "0 0 4px" }}>{s.brand}</h4>
                <span style={{ color: "#888", fontSize: "13px" }}>{s.category}</span>
              </div>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <span style={{ background: s.fitScore >= 8 ? "#14532d" : s.fitScore >= 6 ? "#1c1c00" : "#2d1414", color: s.fitScore >= 8 ? "#4ade80" : s.fitScore >= 6 ? "#fcd34d" : "#f87171", padding: "4px 10px", borderRadius: "20px", fontWeight: "bold" }}>⭐ {s.fitScore}/10</span>
                <span style={{ background: s.confidence === "High" ? "#14532d" : s.confidence === "Medium" ? "#1c1c00" : "#2d1414", color: s.confidence === "High" ? "#4ade80" : s.confidence === "Medium" ? "#fcd34d" : "#f87171", padding: "4px 10px", borderRadius: "20px", fontSize: "13px" }}>{s.confidence}</span>
                <button onClick={() => setSponsorExcluded([...sponsorExcluded, s.brand])}
                  style={{ background: "#2d1414", color: "#f87171", border: "none", borderRadius: "6px", padding: "4px 10px", cursor: "pointer", fontSize: "13px" }}>✕ Remove</button>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)", gap: "8px", margin: "12px 0" }}>
              {Object.entries(s.scoringBreakdown).map(([k, v]) => (
                <div key={k} style={{ background: "#1a0533", borderRadius: "6px", padding: "8px 10px", display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#aaa", fontSize: "12px" }}>{k.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span style={{ color: "#e879f9", fontWeight: "bold", fontSize: "12px" }}>{v}/10</span>
                </div>
              ))}
            </div>

            <p style={{ color: "#ccc", margin: "0 0 8px", fontSize: "14px" }}>📌 {s.whyFit}</p>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", fontSize: "13px" }}>
              <span style={{ color: "#4ade80" }}>💵 {s.estimatedDealINR}</span>
              <span style={{ color: "#38bdf8" }}>🎙️ {s.sponsorFormat}</span>
            </div>
            <p style={{ color: "#fcd34d", margin: "8px 0 4px", fontSize: "13px" }}>🎯 {s.contactAngle}</p>
            <p style={{ color: "#aaa", margin: "0", fontSize: "13px", fontStyle: "italic" }}>"{s.pitchLine}"</p>
          </div>
        ))}

        {sponsorSavedToPipeline
          ? <p style={{ color: "#4ade80", textAlign: "center", marginTop: "12px" }}>✅ Saved to pipeline!</p>
          : <button onClick={() => { setPipeline([...pipeline, { name: sponsorResult.guestName, status: "New", notes: `Sponsors: ${sponsorResult.sponsors.map(s=>s.brand).join(", ")}`, date: "" }]); setSponsorSavedToPipeline(true) }}
              style={{ width: "100%", padding: "12px", marginTop: "12px", borderRadius: "8px", background: "#14532d", color: "#4ade80", fontWeight: "bold", border: "1px solid #4ade80", cursor: "pointer" }}>
              💾 Save to Pipeline
            </button>
        }
      </div>
    )}
  </div>
)}
{/* EPISODE PERFORMANCE PREDICTOR VIEW */}
{view === "performance" && (
  <div style={{ padding: "24px", maxWidth: "900px", margin: "0 auto" }}>
    <h2 style={{ color: "#6c63ff", marginBottom: "8px" }}>📊 Episode Performance Predictor V2</h2>
    <p style={{ color: "#888", marginBottom: "24px" }}>Fill in episode context to get a deep forecast with reasoning and action plan.</p>

    <div style={{ background: "#0e0e1a", border: "1px solid #3730a3", borderRadius: "12px", padding: "24px", marginBottom: "24px" }}>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "16px" }}>

        <div>
          <label style={{ color: "#ccc", fontSize: "13px", display: "block", marginBottom: "6px" }}>Guest Name *</label>
          <input value={perfGuest} onChange={e => setPerfGuest(e.target.value)}
            placeholder="e.g. Samay Raina"
            style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", background: "#1a1a2e", border: "1px solid #3730a3", color: "white", fontSize: "14px", boxSizing: "border-box" }} />
        </div>

        <div>
          <label style={{ color: "#ccc", fontSize: "13px", display: "block", marginBottom: "6px" }}>Guest Type *</label>
          <select value={perfGuestType} onChange={e => setPerfGuestType(e.target.value)}
            style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", background: "#1a1a2e", border: "1px solid #3730a3", color: "white", fontSize: "14px" }}>
            <option value="">Select guest type</option>
            <option>CEO / Founder</option>
            <option>Creator / Comedian</option>
            <option>Actor / Entertainer</option>
            <option>Cricketer / Athlete</option>
            <option>Politician / Bureaucrat</option>
            <option>Domain Expert</option>
            <option>Investor / VC</option>
          </select>
        </div>

        <div>
          <label style={{ color: "#ccc", fontSize: "13px", display: "block", marginBottom: "6px" }}>Episode Goal *</label>
          <select value={perfEpisodeGoal} onChange={e => setPerfEpisodeGoal(e.target.value)}
            style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", background: "#1a1a2e", border: "1px solid #3730a3", color: "white", fontSize: "14px" }}>
            <option value="">Select goal</option>
            <option>Maximum Views</option>
            <option>Sponsor Attractiveness</option>
            <option>Audience Growth</option>
            <option>Clip Virality</option>
            <option>Brand Building</option>
            <option>Community Engagement</option>
          </select>
        </div>

        <div>
          <label style={{ color: "#ccc", fontSize: "13px", display: "block", marginBottom: "6px" }}>Audience Segment *</label>
          <select value={perfAudienceSegment} onChange={e => setPerfAudienceSegment(e.target.value)}
            style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", background: "#1a1a2e", border: "1px solid #3730a3", color: "white", fontSize: "14px" }}>
            <option value="">Select audience</option>
            <option>Students / College</option>
            <option>Young Professionals</option>
            <option>Founders / Entrepreneurs</option>
            <option>Mass Entertainment</option>
            <option>Investors / HNI</option>
          </select>
        </div>

        <div>
          <label style={{ color: "#ccc", fontSize: "13px", display: "block", marginBottom: "6px" }}>Content Style *</label>
          <select value={perfContentStyle} onChange={e => setPerfContentStyle(e.target.value)}
            style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", background: "#1a1a2e", border: "1px solid #3730a3", color: "white", fontSize: "14px" }}>
            <option value="">Select style</option>
            <option>Deep Interview</option>
            <option>Conversational / Casual</option>
            <option>Story-driven</option>
            <option>Debate / Controversial</option>
            <option>Educational / Masterclass</option>
          </select>
        </div>

        <div>
          <label style={{ color: "#ccc", fontSize: "13px", display: "block", marginBottom: "6px" }}>Time Horizon *</label>
          <select value={perfTimeHorizon} onChange={e => setPerfTimeHorizon(e.target.value)}
            style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", background: "#1a1a2e", border: "1px solid #3730a3", color: "white", fontSize: "14px" }}>
            <option value="">Select horizon</option>
            <option>7 days</option>
            <option>30 days</option>
            <option>90 days</option>
          </select>
        </div>

        <div>
          <label style={{ color: "#ccc", fontSize: "13px", display: "block", marginBottom: "6px" }}>Sponsor Angle (optional)</label>
          <input value={perfSponsorAngle} onChange={e => setPerfSponsorAngle(e.target.value)}
            placeholder="e.g. Fintech, EdTech, D2C"
            style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", background: "#1a1a2e", border: "1px solid #3730a3", color: "white", fontSize: "14px", boxSizing: "border-box" }} />
        </div>

        <div>
          <label style={{ color: "#ccc", fontSize: "13px", display: "block", marginBottom: "6px" }}>Benchmark Guest (optional)</label>
          <input value={perfBenchmarkGuest} onChange={e => setPerfBenchmarkGuest(e.target.value)}
            placeholder="e.g. Nikhil Kamath"
            style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", background: "#1a1a2e", border: "1px solid #3730a3", color: "white", fontSize: "14px", boxSizing: "border-box" }} />
        </div>

      </div>

      <button onClick={predictPerformance} disabled={perfLoading}
        style={{ marginTop: "20px", width: "100%", padding: "14px", borderRadius: "8px", background: perfLoading ? "#333" : "linear-gradient(135deg,#3730a3,#6c63ff)", color: "white", fontWeight: "bold", fontSize: "16px", border: "none", cursor: "pointer" }}>
        {perfLoading ? "🔍 Analyzing episode..." : "📊 Generate Performance Forecast"}
      </button>
    </div>

    {perfResult && (
      <div>
        <div style={{ background: "#0e0e1a", border: "1px solid #3730a3", borderRadius: "12px", padding: "20px", marginBottom: "16px" }}>
          <h3 style={{ color: "#6c63ff", margin: "0 0 8px" }}>{perfResult.guestName}</h3>
          <p style={{ color: "#ccc", margin: "0 0 16px" }}>{perfResult.episodeContext}</p>

          <div style={{ background: "#1a1a2e", borderRadius: "10px", padding: "16px", marginBottom: "16px" }}>
            <p style={{ color: "#6c63ff", fontWeight: "bold", margin: "0 0 10px" }}>📈 Views Forecast</p>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <span style={{ color: "#f87171" }}>Low: {perfResult.viewsForecast?.low}</span>
              <span style={{ color: "#fcd34d" }}>Mid: {perfResult.viewsForecast?.mid}</span>
              <span style={{ color: "#4ade80" }}>High: {perfResult.viewsForecast?.high}</span>
            </div>
            <p style={{ color: "#aaa", fontSize: "13px", margin: "8px 0 0" }}>{perfResult.viewsForecast?.reasoning}</p>
          </div>

          <div style={{ background: "#1a1a2e", borderRadius: "10px", padding: "16px", marginBottom: "16px" }}>
            <p style={{ color: "#6c63ff", fontWeight: "bold", margin: "0 0 10px" }}>🎯 Confidence Range</p>
            <p style={{ color: "#4ade80", fontSize: "20px", fontWeight: "bold", margin: "0 0 4px" }}>{perfResult.confidenceRange?.low} — {perfResult.confidenceRange?.high}</p>
            <p style={{ color: "#aaa", fontSize: "13px", margin: "0" }}>{perfResult.confidenceRange?.driver}</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2,1fr)", gap: "10px", marginBottom: "16px" }}>
            {perfResult.metrics && Object.entries(perfResult.metrics).map(([key, val]) => (
              <div key={key} style={{ background: "#1a1a2e", borderRadius: "8px", padding: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ color: "#aaa", fontSize: "12px" }}>{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span style={{ color: "#6c63ff", fontWeight: "bold", fontSize: "13px" }}>{val.score}</span>
                </div>
                <p style={{ color: "#666", fontSize: "12px", margin: "0" }}>{val.reason}</p>
              </div>
            ))}
          </div>

          <div style={{ background: "#1a1a2e", borderRadius: "10px", padding: "16px", marginBottom: "16px" }}>
            <p style={{ color: "#6c63ff", fontWeight: "bold", margin: "0 0 10px" }}>💰 Revenue Estimate</p>
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <span style={{ color: "#ccc", fontSize: "13px" }}>YT Ads: {perfResult.revenueEstimate?.youtubeAds}</span>
              <span style={{ color: "#ccc", fontSize: "13px" }}>Sponsor: {perfResult.revenueEstimate?.sponsorDeal}</span>
              <span style={{ color: "#4ade80", fontWeight: "bold" }}>Total: {perfResult.revenueEstimate?.totalEstimate}</span>
            </div>
            <p style={{ color: "#aaa", fontSize: "13px", margin: "8px 0 0" }}>{perfResult.revenueEstimate?.reasoning}</p>
          </div>

          {perfResult.comparableEpisodes && (
            <div style={{ background: "#1a1a2e", borderRadius: "10px", padding: "16px", marginBottom: "16px" }}>
              <p style={{ color: "#6c63ff", fontWeight: "bold", margin: "0 0 10px" }}>📋 Comparable Episodes</p>
              {perfResult.comparableEpisodes.map((ep, i) => (
                <div key={i} style={{ marginBottom: "8px" }}>
                  <span style={{ color: "#fcd34d", fontWeight: "bold" }}>{ep.guest}</span>
                  <span style={{ color: "#4ade80", marginLeft: "10px" }}>{ep.views}</span>
                  <p style={{ color: "#888", fontSize: "12px", margin: "2px 0 0" }}>{ep.similarity}</p>
                </div>
              ))}
            </div>
          )}

          <div style={{ background: "#1a1a2e", borderRadius: "10px", padding: "16px", marginBottom: "16px" }}>
            <p style={{ color: "#6c63ff", fontWeight: "bold", margin: "0 0 10px" }}>🔧 Improvement Actions</p>
            {perfResult.improvementActions?.map((a, i) => (
              <p key={i} style={{ color: "#ccc", fontSize: "13px", margin: "0 0 6px" }}>• {a}</p>
            ))}
          </div>

          <div style={{ background: "#1a1a2e", borderRadius: "10px", padding: "16px", marginBottom: "16px" }}>
            <p style={{ color: "#6c63ff", fontWeight: "bold", margin: "0 0 8px" }}>📅 Publish Strategy</p>
            <p style={{ color: "#4ade80", margin: "0 0 4px" }}>Best Day: {perfResult.publishStrategy?.bestDay} at {perfResult.publishStrategy?.bestTime}</p>
            <p style={{ color: "#aaa", fontSize: "13px", margin: "0" }}>{perfResult.publishStrategy?.reasoning}</p>
          </div>

          <div style={{ background: perfResult.finalVerdict === "PUBLISH NOW" || perfResult.finalVerdict === "STRONG YES" ? "#14532d" : perfResult.finalVerdict === "REVISE FIRST" ? "#1c1c00" : "#2d1414", border: `1px solid ${perfResult.finalVerdict === "PUBLISH NOW" || perfResult.finalVerdict === "STRONG YES" ? "#4ade80" : perfResult.finalVerdict === "REVISE FIRST" ? "#fcd34d" : "#f87171"}`, borderRadius: "10px", padding: "16px" }}>
            <p style={{ color: perfResult.finalVerdict === "PUBLISH NOW" || perfResult.finalVerdict === "STRONG YES" ? "#4ade80" : perfResult.finalVerdict === "REVISE FIRST" ? "#fcd34d" : "#f87171", fontWeight: "bold", fontSize: "20px", margin: "0 0 8px" }}>
              {perfResult.finalVerdict === "PUBLISH NOW" || perfResult.finalVerdict === "STRONG YES" ? "✅" : perfResult.finalVerdict === "REVISE FIRST" ? "⚠️" : "❌"} {perfResult.finalVerdict}
            </p>
            <p style={{ color: "#ccc", margin: "0", fontSize: "14px" }}>{perfResult.verdictReason}</p>
          </div>

          <button onClick={() => { setPerfGuest(""); setPerfResult(null); setPerfGuestType(""); setPerfEpisodeGoal(""); setPerfAudienceSegment(""); setPerfContentStyle(""); setPerfTimeHorizon("") }}
            style={{ marginTop: "16px", padding: "10px 20px", borderRadius: "8px", background: "#1a1a2e", color: "#6c63ff", border: "1px solid #3730a3", cursor: "pointer" }}>
            🔄 New Prediction
          </button>
        </div>
      </div>
    )}
  </div>
)}

{view === "gaps" && (
<div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
  <h2 style={{ color: "#a855f7", marginBottom: "8px" }}>🔍 Content Gap Finder</h2>
  <p style={{ color: "#888", marginBottom: "24px" }}>Discover what competitors are winning at — and where Raj should strike next.</p>
  <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "280px 1fr", gap: "24px" }}>
    <div style={{ background: "#1a1a2e", border: "1px solid #a855f7", borderRadius: "12px", padding: "20px" }}>
      <h3 style={{ color: "#a855f7", marginBottom: "16px" }}>⚙️ Configure Analysis</h3>
      <label style={{ color: "#ccc", fontSize: "13px", display: "block", marginBottom: "6px" }}>Select Competitors</label>
      {["Nikhil Kamath", "Ankur Warikoo", "Ranveer Allahbadia", "Sharan Hegde", "Varun Mayya", "Think School", "Lex Fridman", "My First Million", "Diary of a CEO", "How I Built This"].map(c => (
        <label key={c} style={{ display: "flex", alignItems: "center", gap: "8px", color: "#ccc", fontSize: "13px", marginBottom: "8px", cursor: "pointer" }}>
          <input type="checkbox" checked={gapCompetitors.includes(c)} onChange={() => setGapCompetitors(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])} />
          {c}
        </label>
      ))}
      <label style={{ color: "#ccc", fontSize: "13px", display: "block", marginTop: "16px", marginBottom: "6px" }}>Time Range</label>
      <select value={gapTimeRange} onChange={e => setGapTimeRange(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "8px", background: "#0d0900", color: "#fff", border: "1px solid #333" }}>
        <option value="30">Last 30 Days</option>
        <option value="60">Last 60 Days</option>
        <option value="90">Last 90 Days</option>
        <option value="180">Last 180 Days</option>
      </select>
      <label style={{ color: "#ccc", fontSize: "13px", display: "block", marginTop: "16px", marginBottom: "6px" }}>Growth Goal</label>
      <select value={gapGoal} onChange={e => setGapGoal(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "8px", background: "#0d0900", color: "#fff", border: "1px solid #333" }}>
        <option value="views">Maximum Views</option>
        <option value="sponsors">Sponsor Revenue</option>
        <option value="authority">Thought Authority</option>
      </select>
      <button onClick={generateGapAnalysis} disabled={loadingGaps} style={{ width: "100%", marginTop: "20px", padding: "12px", borderRadius: "8px", background: "#a855f7", color: "#fff", border: "none", cursor: "pointer", fontWeight: "bold", fontSize: "14px" }}>
        {loadingGaps ? "🔄 Analyzing..." : "🔍 Find Gaps"}
      </button>
    </div>
    <div>
      {!gapResult && !loadingGaps && (
        <div style={{ background: "#1a1a2e", borderRadius: "12px", padding: "40px", textAlign: "center", color: "#555" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
          <p>Select competitors and click Find Gaps to discover content opportunities</p>
        </div>
      )}
      {loadingGaps && (
        <div style={{ background: "#1a1a2e", borderRadius: "12px", padding: "40px", textAlign: "center", color: "#a855f7" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>⏳</div>
          <p>Analyzing competitor content and finding gaps...</p>
        </div>
      )}
      {gapResult && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "16px" }}>
            {gapResult.map((gap, i) => (
              <div key={i} onClick={() => setSelectedGap(selectedGap === i ? null : i)} style={{ background: "#1a1a2e", border: `1px solid ${gap.priority === "High" ? "#ef4444" : gap.priority === "Medium" ? "#f59e0b" : "#22c55e"}`, borderRadius: "12px", padding: "16px", cursor: "pointer" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ background: gap.priority === "High" ? "#ef444420" : gap.priority === "Medium" ? "#f59e0b20" : "#22c55e20", color: gap.priority === "High" ? "#ef4444" : gap.priority === "Medium" ? "#f59e0b" : "#22c55e", padding: "2px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: "bold" }}>{gap.priority} Priority</span>
                  <span style={{ background: "#a855f720", color: "#a855f7", padding: "2px 8px", borderRadius: "4px", fontSize: "11px" }}>{gap.type}</span>
                </div>
                <h4 style={{ color: "#fff", marginBottom: "8px", fontSize: "14px" }}>{gap.title}</h4>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#888" }}>
                  <span>📈 Score: {gap.priorityScore}/10</span>
                  <span>🔥 {gap.competitorMomentum} Momentum</span>
                </div>
                {selectedGap === i && (
                  <div style={{ marginTop: "16px", borderTop: "1px solid #333", paddingTop: "16px" }}>
                    <p style={{ color: "#f59e0b", fontSize: "12px", marginBottom: "8px" }}>💡 Why Competitors Winning: <span style={{ color: "#ccc" }}>{gap.whyCompetitorsWinning}</span></p>
                    <p style={{ color: "#f59e0b", fontSize: "12px", marginBottom: "8px" }}>📊 Raj's Coverage: <span style={{ color: "#ccc" }}>{gap.rajCoverageStatus}</span></p>
                    <p style={{ color: "#f59e0b", fontSize: "12px", marginBottom: "8px" }}>🚀 Upside: <span style={{ color: "#22c55e" }}>{gap.estimatedUpside}</span></p>
                    <p style={{ color: "#f59e0b", fontSize: "12px", marginBottom: "8px" }}>🎯 Suggested Guest: <span style={{ color: "#a855f7" }}>{gap.suggestedGuest}</span></p>
                    <p style={{ color: "#f59e0b", fontSize: "12px", marginBottom: "8px" }}>🎙️ Episode Angle: <span style={{ color: "#ccc" }}>{gap.episodeAngle}</span></p>
                    <p style={{ color: "#f59e0b", fontSize: "12px", marginBottom: "8px" }}>💰 Sponsor Tie-in: <span style={{ color: "#ccc" }}>{gap.sponsorTieIn}</span></p>
                    <p style={{ color: "#f59e0b", fontSize: "12px", marginBottom: "8px" }}>📌 Evidence: <span style={{ color: "#ccc" }}>{gap.evidence}</span></p>
                    <button onClick={e => { e.stopPropagation(); setPipelineGuests(prev => [...prev, { name: gap.suggestedGuest, status: "New", notes: gap.episodeAngle, addedAt: new Date().toISOString() }]); alert(gap.suggestedGuest + " added to pipeline!") }} style={{ marginTop: "8px", padding: "8px 16px", borderRadius: "8px", background: "#a855f7", color: "#fff", border: "none", cursor: "pointer", fontSize: "12px" }}>➕ Add to Pipeline</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
</div>
)}
{/* GUEST ROI CALCULATOR VIEW */}
{view === "roi" && (
  <div style={{ padding: "24px", maxWidth: "960px", margin: "0 auto" }}>
    <h2 style={{ color: "#f59e0b", marginBottom: "8px" }}>💰 Guest ROI Calculator V2</h2>
    <p style={{ color: "#888", marginBottom: "24px" }}>Enter real costs and revenue assumptions to get a credible ROI forecast with scenarios.</p>

    {/* EPISODE SETUP */}
    <div style={{ background: "#1a1200", border: "1px solid #92400e", borderRadius: "12px", padding: "24px", marginBottom: "20px" }}>
      <h3 style={{ color: "#f59e0b", margin: "0 0 16px" }}>📋 Episode Setup</h3>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "16px" }}>
        <div>
          <label style={{ color: "#ccc", fontSize: "13px", display: "block", marginBottom: "6px" }}>Guest Name *</label>
          <input value={roiGuest} onChange={e => setRoiGuest(e.target.value)} placeholder="e.g. Nikhil Kamath"
            style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", background: "#0d0900", border: "1px solid #92400e", color: "white", fontSize: "14px", boxSizing: "border-box" }} />
        </div>
        <div>
          <label style={{ color: "#ccc", fontSize: "13px", display: "block", marginBottom: "6px" }}>Guest Type *</label>
          <select value={roiGuestType} onChange={e => setRoiGuestType(e.target.value)}
            style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", background: "#0d0900", border: "1px solid #92400e", color: "white", fontSize: "14px" }}>
            <option value="">Select type</option>
            <option>CEO / Founder</option>
            <option>Creator / Influencer</option>
            <option>Actor / Entertainer</option>
            <option>Cricketer / Athlete</option>
            <option>Investor / VC</option>
            <option>Domain Expert</option>
          </select>
        </div>
        <div>
          <label style={{ color: "#ccc", fontSize: "13px", display: "block", marginBottom: "6px" }}>Episode Objective *</label>
          <select value={roiEpisodeObjective} onChange={e => setRoiEpisodeObjective(e.target.value)}
            style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", background: "#0d0900", border: "1px solid #92400e", color: "white", fontSize: "14px" }}>
            <option value="">Select objective</option>
            <option>Maximum Views</option>
            <option>Sponsor Revenue</option>
            <option>Brand Building</option>
            <option>Audience Growth</option>
            <option>Clip Virality</option>
          </select>
        </div>
        <div>
          <label style={{ color: "#ccc", fontSize: "13px", display: "block", marginBottom: "6px" }}>Expected Views Range *</label>
          <select value={roiExpectedViews} onChange={e => setRoiExpectedViews(e.target.value)}
            style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", background: "#0d0900", border: "1px solid #92400e", color: "white", fontSize: "14px" }}>
            <option value="">Select range</option>
            <option>Under 500K</option>
            <option>500K – 1M</option>
            <option>1M – 2M</option>
            <option>2M – 5M</option>
            <option>5M+</option>
          </select>
        </div>
        <div>
          <label style={{ color: "#ccc", fontSize: "13px", display: "block", marginBottom: "6px" }}>Guest Status</label>
          <select value={roiGuestStatus} onChange={e => setRoiGuestStatus(e.target.value)}
            style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", background: "#0d0900", border: "1px solid #92400e", color: "white", fontSize: "14px" }}>
            <option value="">Select</option>
            <option>First Time Guest</option>
            <option>Repeat Guest</option>
          </select>
        </div>
        <div>
          <label style={{ color: "#ccc", fontSize: "13px", display: "block", marginBottom: "6px" }}>Sponsor Status</label>
          <select value={roiSponsorStatus} onChange={e => setRoiSponsorStatus(e.target.value)}
            style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", background: "#0d0900", border: "1px solid #92400e", color: "white", fontSize: "14px" }}>
            <option value="">Select</option>
            <option>Sponsor Already Secured</option>
            <option>Sponsor Being Pitched</option>
            <option>No Sponsor Yet</option>
          </select>
        </div>
      </div>
    </div>

    {/* COST INPUTS */}
    <div style={{ background: "#1a0a0a", border: "1px solid #7f1d1d", borderRadius: "12px", padding: "24px", marginBottom: "20px" }}>
      <h3 style={{ color: "#f87171", margin: "0 0 16px" }}>📉 Cost Inputs (edit each value in ₹)</h3>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)", gap: "12px" }}>
        {[
          ["Editor", roiCostEditor, setRoiCostEditor],
          ["Clips Editor", roiCostClipsEditor, setRoiCostClipsEditor],
          ["Thumbnail", roiCostThumbnail, setRoiCostThumbnail],
          ["Studio", roiCostStudio, setRoiCostStudio],
          ["Research", roiCostResearch, setRoiCostResearch],
          ["Outreach", roiCostOutreach, setRoiCostOutreach],
          ["Appearance Fee", roiCostAppearanceFee, setRoiCostAppearanceFee],
          ["Guest Travel", roiCostTravel, setRoiCostTravel],
          ["Guest Hotel", roiCostHotel, setRoiCostHotel],
          ["Hospitality", roiCostHospitality, setRoiCostHospitality],
          ["Tools/Software", roiCostTools, setRoiCostTools],
          ["Misc", roiCostMisc, setRoiCostMisc],
        ].map(([label, val, setter]) => (
          <div key={label}>
            <label style={{ color: "#aaa", fontSize: "12px", display: "block", marginBottom: "4px" }}>{label}</label>
            <input type="number" value={val} onChange={e => setter(e.target.value)}
              style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", background: "#0d0000", border: "1px solid #7f1d1d", color: "white", fontSize: "13px", boxSizing: "border-box" }} />
          </div>
        ))}
      </div>
      <p style={{ color: "#f87171", fontWeight: "bold", marginTop: "12px" }}>
        Total Costs: ₹{([Number(roiCostEditor),Number(roiCostClipsEditor),Number(roiCostThumbnail),Number(roiCostStudio),Number(roiCostResearch),Number(roiCostOutreach),Number(roiCostAppearanceFee),Number(roiCostTravel),Number(roiCostHotel),Number(roiCostHospitality),Number(roiCostTools),Number(roiCostMisc)].reduce((a,b)=>a+b,0)).toLocaleString()}
      </p>
    </div>

    {/* REVENUE INPUTS */}
    <div style={{ background: "#0a1a0a", border: "1px solid #14532d", borderRadius: "12px", padding: "24px", marginBottom: "20px" }}>
      <h3 style={{ color: "#4ade80", margin: "0 0 8px" }}>📈 Revenue Inputs (leave blank to auto-estimate)</h3>
      <p style={{ color: "#666", fontSize: "13px", margin: "0 0 16px" }}>Enter known values. Blank fields will be estimated by AI based on your episode context.</p>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)", gap: "12px" }}>
        {[
          ["YouTube Ads ₹", roiRevYouTube, setRoiRevYouTube],
          ["Sponsor Deal ₹", roiRevSponsor, setRoiRevSponsor],
          ["Brand Deal ₹", roiRevBrandDeal, setRoiRevBrandDeal],
          ["Clips Revenue ₹", roiRevClips, setRoiRevClips],
          ["Long-tail Archive ₹", roiRevLongTail, setRoiRevLongTail],
          ["Brand Lift Value ₹", roiRevBrandLift, setRoiRevBrandLift],
        ].map(([label, val, setter]) => (
          <div key={label}>
            <label style={{ color: "#aaa", fontSize: "12px", display: "block", marginBottom: "4px" }}>{label}</label>
            <input type="number" value={val} onChange={e => setter(e.target.value)} placeholder="auto"
              style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", background: "#000d00", border: "1px solid #14532d", color: "white", fontSize: "13px", boxSizing: "border-box" }} />
          </div>
        ))}
      </div>
    </div>

    <button onClick={calculateROI} disabled={roiLoading}
      style={{ width: "100%", padding: "14px", borderRadius: "8px", background: roiLoading ? "#333" : "linear-gradient(135deg,#92400e,#f59e0b)", color: "white", fontWeight: "bold", fontSize: "16px", border: "none", cursor: "pointer", marginBottom: "24px" }}>
      {roiLoading ? "🔍 Calculating ROI..." : "💰 Calculate Episode ROI"}
    </button>

    {/* RESULTS */}
    {roiResult && (
      <div>
        <div style={{ background: "#1a1200", border: "1px solid #92400e", borderRadius: "12px", padding: "20px", marginBottom: "16px" }}>
          <h3 style={{ color: "#f59e0b", margin: "0 0 6px" }}>{roiResult.guestName}</h3>
          <p style={{ color: "#ccc", margin: "0 0 16px" }}>{roiResult.episodeSummary}</p>

          {/* COST BREAKDOWN */}
          <div style={{ background: "#0d0900", borderRadius: "10px", padding: "16px", marginBottom: "16px" }}>
            <p style={{ color: "#f87171", fontWeight: "bold", margin: "0 0 10px" }}>📉 Cost Breakdown</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "8px" }}>
              {roiResult.costBreakdown && Object.entries(roiResult.costBreakdown).map(([k,v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#aaa", fontSize: "13px" }}>{k}</span>
                  <span style={{ color: "#f87171", fontSize: "13px" }}>{v}</span>
                </div>
              ))}
            </div>
            <p style={{ color: "#f87171", fontWeight: "bold", marginTop: "8px" }}>Total: ₹{roiResult.totalCosts?.toLocaleString()}</p>
          </div>

          {/* 3 SCENARIOS */}
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)", gap: "12px", marginBottom: "16px" }}>
            {roiResult.scenarios && Object.entries(roiResult.scenarios).map(([scenario, data]) => (
              <div key={scenario} style={{ background: scenario === "low" ? "#2d0000" : scenario === "base" ? "#1a1200" : "#0a1a0a", border: `1px solid ${scenario === "low" ? "#f87171" : scenario === "base" ? "#f59e0b" : "#4ade80"}`, borderRadius: "10px", padding: "16px" }}>
                <p style={{ color: scenario === "low" ? "#f87171" : scenario === "base" ? "#f59e0b" : "#4ade80", fontWeight: "bold", margin: "0 0 8px", textTransform: "uppercase" }}>{scenario} Case</p>
                <p style={{ color: "white", fontSize: "18px", fontWeight: "bold", margin: "0 0 4px" }}>{data.netROI}</p>
                <p style={{ color: "#aaa", fontSize: "13px", margin: "0 0 4px" }}>ROI: {data.roiPercentage}</p>
                <p style={{ color: "#aaa", fontSize: "13px", margin: "0 0 8px" }}>Revenue: {data.totalRevenue}</p>
                <p style={{ color: "#666", fontSize: "12px", margin: "0" }}>Confidence: {data.confidence}</p>
              </div>
            ))}
          </div>

          {/* KEY METRICS */}
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)", gap: "10px", marginBottom: "16px" }}>
            {[
              ["Payback Period", roiResult.paybackPeriod, "#f59e0b"],
              ["Break-even Views", roiResult.breakEvenViews, "#38bdf8"],
              ["Guest Monetization", roiResult.guestMonetizationScore, "#a78bfa"],
              ["Sponsor Readiness", roiResult.sponsorReadinessScore, "#4ade80"],
              ["Clip ROI Score", roiResult.clipROIScore, "#fb923c"],
              ["Best Sponsor Cat.", roiResult.bestSponsorCategory, "#f472b6"],
            ].map(([label, val, color]) => (
              <div key={label} style={{ background: "#0d0900", borderRadius: "8px", padding: "12px", textAlign: "center" }}>
                <p style={{ color: color, fontWeight: "bold", fontSize: "16px", margin: "0 0 4px" }}>{val}</p>
                <p style={{ color: "#666", fontSize: "12px", margin: "0" }}>{label}</p>
              </div>
            ))}
          </div>

          {/* SENSITIVITY */}
          <div style={{ background: "#1a0a0a", borderRadius: "10px", padding: "16px", marginBottom: "16px" }}>
            <p style={{ color: "#f87171", fontWeight: "bold", margin: "0 0 8px" }}>⚠️ Sensitivity Warning</p>
            <p style={{ color: "#ccc", fontSize: "13px", margin: "0" }}>{roiResult.sensitivityWarning}</p>
          </div>

          {/* IMPROVEMENT ACTIONS */}
          <div style={{ background: "#0a1a0a", borderRadius: "10px", padding: "16px", marginBottom: "16px" }}>
            <p style={{ color: "#4ade80", fontWeight: "bold", margin: "0 0 8px" }}>🔧 Improvement Actions</p>
            {roiResult.improvementActions?.map((a, i) => (
              <p key={i} style={{ color: "#ccc", fontSize: "13px", margin: "0 0 6px" }}>• {a}</p>
            ))}
          </div>

          {/* VERDICT */}
          <div style={{ background: roiResult.verdict === "PROCEED" ? "#14532d" : roiResult.verdict === "OPTIMIZE" ? "#1c1c00" : "#2d1414", border: `1px solid ${roiResult.verdict === "PROCEED" ? "#4ade80" : roiResult.verdict === "OPTIMIZE" ? "#fcd34d" : "#f87171"}`, borderRadius: "10px", padding: "16px" }}>
            <p style={{ color: roiResult.verdict === "PROCEED" ? "#4ade80" : roiResult.verdict === "OPTIMIZE" ? "#fcd34d" : "#f87171", fontWeight: "bold", fontSize: "22px", margin: "0 0 8px" }}>
              {roiResult.verdict === "PROCEED" ? "✅" : roiResult.verdict === "OPTIMIZE" ? "⚠️" : "❌"} {roiResult.verdict} — Grade {roiResult.roiGrade}
            </p>
            <p style={{ color: "#ccc", fontSize: "14px", margin: "0" }}>{roiResult.verdictReason}</p>
          </div>

          <button onClick={() => { setRoiGuest(""); setRoiResult(null); setRoiGuestType(""); setRoiEpisodeObjective(""); setRoiExpectedViews("") }}
            style={{ marginTop: "16px", padding: "10px 20px", borderRadius: "8px", background: "#1a1200", color: "#f59e0b", border: "1px solid #92400e", cursor: "pointer" }}>
            🔄 New Calculation
          </button>
        </div>
      </div>
    )}
  </div>
)}
{view === "outcomes" && (
  <div style={{ padding: "24px", maxWidth: "1000px", margin: "0 auto" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
      <div>
        <h2 style={{ color: "#38bdf8", margin: "0 0 4px" }}>📊 Outcome Analytics</h2>
        <p style={{ color: "#888", fontSize: "13px", margin: 0 }}>{episodeOutcomes.length} episodes tracked</p>
      </div>
      <div style={{ display: "flex", gap: "8px" }}>
        <button onClick={generateOutcomeInsights} disabled={outcomesLoading || episodeOutcomes.length === 0} style={{ padding: "8px 16px", background: "#1e3a5f", color: "#38bdf8", border: "1px solid #38bdf8", borderRadius: "8px", cursor: "pointer", fontSize: "13px" }}>
          {outcomesLoading ? "Analysing..." : "🤖 Generate Insights"}
        </button>
        <button onClick={() => setShowOutcomeForm(!showOutcomeForm)} style={{ padding: "8px 16px", background: "#166534", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px" }}>
          + Log Episode
        </button>
      </div>
    </div>

    {/* Summary Bar */}
    {episodeOutcomes.length > 0 && (
      <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
        {[
          { label: "Avg Views", value: Math.round(episodeOutcomes.reduce((a,b) => a + b.actual_views, 0) / episodeOutcomes.length).toLocaleString() },
          { label: "Total Sponsor Revenue", value: "₹" + episodeOutcomes.reduce((a,b) => a + b.sponsor_value, 0).toLocaleString() },
          { label: "Avg CTR", value: (episodeOutcomes.reduce((a,b) => a + b.ctr, 0) / episodeOutcomes.length).toFixed(1) + "%" },
          { label: "Avg Retention", value: (episodeOutcomes.reduce((a,b) => a + b.retention, 0) / episodeOutcomes.length).toFixed(1) + "%" },
          { label: "Total Clips", value: episodeOutcomes.reduce((a,b) => a + b.clip_count, 0) },
          { label: "Subscriber Lift", value: "+" + episodeOutcomes.reduce((a,b) => a + b.subscriber_lift, 0).toLocaleString() }
        ].map(m => (
          <div key={m.label} style={{ background: darkMode ? "#111827" : "#f0f4f8", borderRadius: "10px", padding: "14px 18px", flex: "1", minWidth: "140px", border: "1px solid #222" }}>
            <div style={{ color: "#38bdf8", fontSize: "18px", fontWeight: "bold" }}>{m.value}</div>
            <div style={{ color: "#888", fontSize: "11px", marginTop: "4px" }}>{m.label}</div>
          </div>
        ))}
      </div>
    )}

    {/* Log Episode Form */}
    {showOutcomeForm && (
      <div style={{ background: darkMode ? "#111827" : "#f0f4f8", borderRadius: "12px", padding: "20px", marginBottom: "24px", border: "1px solid #333" }}>
        <h3 style={{ color: "#38bdf8", marginBottom: "16px" }}>Log Episode Outcome</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          {[
            { key: "guest_name", label: "Guest Name" },
            { key: "guest_type", label: "Guest Type" },
            { key: "episode_title", label: "Episode Title" },
            { key: "episode_date", label: "Episode Date", type: "date" },
            { key: "predicted_views", label: "Predicted Views" },
            { key: "actual_views", label: "Actual Views" },
            { key: "watch_time_pct", label: "Watch Time %" },
            { key: "ctr", label: "CTR %" },
            { key: "retention", label: "Retention %" },
            { key: "likes", label: "Likes" },
            { key: "comments", label: "Comments" },
            { key: "shares", label: "Shares" },
            { key: "subscriber_lift", label: "Subscriber Lift" },
            { key: "clip_count", label: "Clip Count" },
            { key: "clip_views", label: "Clip Views" },
            { key: "sponsor_value", label: "Sponsor Value (₹)" },
            { key: "brand_deal", label: "Brand Deal (₹)" },
            { key: "total_cost", label: "Total Cost (₹)" },
            { key: "outreach_days", label: "Outreach Days" },
            { key: "approval_days", label: "Approval Days" }
          ].map(f => (
            <div key={f.key}>
              <label style={{ color: "#888", fontSize: "11px" }}>{f.label}</label>
              <input type={f.type || "text"} value={outcomeForm[f.key]} onChange={e => setOutcomeForm({...outcomeForm, [f.key]: e.target.value})}
                style={{ width: "100%", padding: "7px", borderRadius: "6px", background: darkMode ? "#1a1a2e" : "#fff", color: darkMode ? "#fff" : "#000", border: "1px solid #333", marginTop: "4px", boxSizing: "border-box" }} />
            </div>
          ))}
        </div>
        <textarea placeholder="Notes..." value={outcomeForm.notes} onChange={e => setOutcomeForm({...outcomeForm, notes: e.target.value})}
          style={{ width: "100%", marginTop: "12px", padding: "8px", borderRadius: "6px", background: darkMode ? "#1a1a2e" : "#fff", color: darkMode ? "#fff" : "#000", border: "1px solid #333", boxSizing: "border-box", minHeight: "60px" }} />
        <button onClick={saveOutcome} disabled={outcomesLoading} style={{ marginTop: "12px", padding: "10px 24px", background: "#166534", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>
          {outcomesLoading ? "Saving..." : "Save Episode"}
        </button>
      </div>
    )}

    {/* AI Insights */}
    {outcomeInsights && (
      <div style={{ marginBottom: "24px" }}>
        <h3 style={{ color: "#f59e0b", marginBottom: "12px" }}>🤖 AI Strategy Insights</h3>
        <div style={{ display: "grid", gap: "10px" }}>
          {outcomeInsights.map((ins, i) => (
            <div key={i} style={{ background: darkMode ? "#1a1a0a" : "#fffbeb", borderRadius: "10px", padding: "14px", border: "1px solid #854d0e" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <span style={{ color: "#f59e0b", fontWeight: "bold", fontSize: "13px" }}>{ins.category}</span>
                <span style={{ color: "#4ade80", fontSize: "12px" }}>Impact: {ins.impact}</span>
              </div>
              <p style={{ color: darkMode ? "#fff" : "#000", margin: "0 0 6px", fontSize: "14px" }}>{ins.insight}</p>
              <p style={{ color: "#38bdf8", fontSize: "12px", margin: 0 }}>→ {ins.action}</p>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Episode Cards */}
    <h3 style={{ color: "#38bdf8", marginBottom: "12px" }}>📺 Episode Performance</h3>
    {episodeOutcomes.length === 0
      ? <p style={{ color: "#666" }}>No episodes logged yet. Click "+ Log Episode" to start.</p>
      : episodeOutcomes.map(ep => {
        const roi = ep.total_cost > 0 ? (((ep.sponsor_value + ep.brand_deal) / ep.total_cost) * 100).toFixed(0) : 0
        const vsPredict = ep.predicted_views > 0 ? (((ep.actual_views - ep.predicted_views) / ep.predicted_views) * 100).toFixed(0) : null
        const verdict = vsPredict > 10 ? "Outperformed" : vsPredict < -10 ? "Underperformed" : "Met Expectations"
        const verdictColor = verdict === "Outperformed" ? "#4ade80" : verdict === "Underperformed" ? "#f87171" : "#f59e0b"
        return (
          <div key={ep.id} style={{ background: darkMode ? "#111827" : "#f0f4f8", borderRadius: "12px", padding: "16px", marginBottom: "12px", border: "1px solid #222" }}>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", marginBottom: "12px" }}>
              <div>
                <strong style={{ color: "#fff", fontSize: "15px" }}>{ep.guest_name}</strong>
                <span style={{ marginLeft: "8px", color: "#888", fontSize: "12px" }}>{ep.guest_type}</span>
                <p style={{ color: "#666", fontSize: "12px", margin: "2px 0 0" }}>{ep.episode_title}</p>
              </div>
              <span style={{ color: verdictColor, fontWeight: "bold", fontSize: "13px" }}>{verdict}</span>
            </div>
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              {[
                { label: "Views", value: ep.actual_views?.toLocaleString() },
                { label: "CTR", value: ep.ctr + "%" },
                { label: "Retention", value: ep.retention + "%" },
                { label: "Clips", value: ep.clip_count },
                { label: "Sponsor", value: "₹" + ep.sponsor_value?.toLocaleString() },
                { label: "ROI", value: roi + "%" },
                { label: "vs Prediction", value: vsPredict ? vsPredict + "%" : "N/A" }
              ].map(m => (
                <div key={m.label} style={{ textAlign: "center" }}>
                  <div style={{ color: "#38bdf8", fontWeight: "bold", fontSize: "14px" }}>{m.value}</div>
                  <div style={{ color: "#666", fontSize: "10px" }}>{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        )
      })
    }
  </div>
)}
        {/* PIPELINE VIEW */}
        {view === "team" && (
  <div style={{ padding: "24px", maxWidth: "900px", margin: "0 auto" }}>
    <h2 style={{ color: "#38bdf8", marginBottom: "4px" }}>👥 Team & Approvals</h2>
    <p style={{ color: "#888", fontSize: "13px", marginBottom: "24px" }}>Role: <strong style={{ color: "#4ade80" }}>{userRole.replace("_", " ").toUpperCase()}</strong></p>

    {/* Pending Approvals */}
    <div style={{ marginBottom: "32px" }}>
      <h3 style={{ color: "#f59e0b", marginBottom: "12px" }}>⏳ Pending Approvals ({approvalRequests.filter(a => a.status === "pending").length})</h3>
      {approvalRequests.filter(a => a.status === "pending").length === 0
        ? <p style={{ color: "#666" }}>No pending approvals</p>
        : approvalRequests.filter(a => a.status === "pending").map(req => (
          <div key={req.id} style={{ background: darkMode ? "#1a1a2e" : "#f0f4f8", borderRadius: "10px", padding: "16px", marginBottom: "12px", border: "1px solid #333" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
              <div>
                <strong style={{ color: "#fff" }}>{req.guest_name}</strong>
                <span style={{ marginLeft: "8px", background: "#1e3a5f", color: "#38bdf8", padding: "2px 8px", borderRadius: "20px", fontSize: "11px" }}>{req.approval_type.replace("_", " ")}</span>
                <p style={{ color: "#888", fontSize: "12px", margin: "4px 0 0" }}>By: {req.requested_by} · {new Date(req.created_at).toLocaleDateString('en-IN')}</p>
              </div>
              {(userRole === "admin" || userRole === "lead_producer") && (
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={() => approveItem(req.id, req.guest_name, "Approved")} style={{ padding: "6px 14px", background: "#166534", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>✅ Approve</button>
                  <button onClick={() => rejectItem(req.id, req.guest_name, "Rejected")} style={{ padding: "6px 14px", background: "#7f1d1d", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>❌ Reject</button>
                </div>
              )}
            </div>
          </div>
        ))
      }
    </div>

    {/* All Approvals History */}
    <div style={{ marginBottom: "32px" }}>
      <h3 style={{ color: "#38bdf8", marginBottom: "12px" }}>📋 Approval History</h3>
      {approvalRequests.filter(a => a.status !== "pending").slice(0, 10).map(req => (
        <div key={req.id} style={{ background: darkMode ? "#0f1a0f" : "#f0f4f8", borderRadius: "8px", padding: "12px", marginBottom: "8px", border: `1px solid ${req.status === "approved" ? "#166534" : "#7f1d1d"}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
            <span style={{ color: "#fff" }}>{req.guest_name} — <span style={{ color: "#888", fontSize: "12px" }}>{req.approval_type.replace("_", " ")}</span></span>
            <span style={{ color: req.status === "approved" ? "#4ade80" : "#f87171", fontSize: "12px" }}>{req.status.toUpperCase()} by {req.reviewed_by}</span>
          </div>
        </div>
      ))}
    </div>

    {/* Team Members — Admin only */}
    {userRole === "admin" && (
      <div>
        <h3 style={{ color: "#38bdf8", marginBottom: "12px" }}>🔐 Team Members</h3>
        <p style={{ color: "#888", fontSize: "12px", marginBottom: "12px" }}>Add members via Supabase → team_members table. Roles: admin, lead_producer, researcher, outreach, viewer</p>
      </div>
    )}
  </div>
)}
        {view === "pipeline" && (
          <div>
            <div style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
              <div>
                <h2 style={{ margin: "0 0 4px", color: "#38bdf8" }}>📋 Guest Pipeline — CRM <span style={{ fontSize: "12px", color: "#4ade80" }}>☁️ Cloud Synced</span></h2>
                <p style={{ margin: 0, fontSize: "12px", color: "#555" }}>Track, manage and follow up with all your podcast guests</p>
              </div>
              <button onClick={exportPipelineToCSV} style={{ padding: "8px 16px", borderRadius: "8px", background: "#1a2e1a", color: "#4ade80", border: "1px solid #166534", cursor: "pointer", fontSize: "13px", fontWeight: "bold" }}>📥 Export Pipeline CSV</button>
            </div>
            <div style={{ display: "flex", gap: "10px", marginBottom: "16px", flexWrap: "wrap" }}>
              {["All", "New", "Contacted", "Booked", "Declined"].map(s => (
                <div key={s} onClick={() => setPipelineFilter(s)} style={{ padding: "10px 16px", borderRadius: "10px", background: pipelineFilter === s ? "#1e3a5f" : "#111827", border: `1px solid ${pipelineFilter === s ? "#3b82f6" : "#333"}`, cursor: "pointer", textAlign: "center", minWidth: "70px" }}>
                  <div style={{ fontSize: "18px", fontWeight: "bold", color: s === "Booked" ? "#00ff88" : s === "Contacted" ? "#ffaa00" : s === "Declined" ? "#ff6666" : s === "New" ? "#a78bfa" : "#38bdf8" }}>
                    {s === "All" ? pipeline.length : pipeline.filter(g => g.status === s).length}
                  </div>
                  <div style={{ fontSize: "11px", color: "#666", marginTop: "2px" }}>{s}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: "8px", marginBottom: "16px", alignItems: "center" }}>
              <span style={{ fontSize: "12px", color: "#666" }}>Sort:</span>
              {["score", "date", "name"].map(s => (
                <button key={s} onClick={() => setPipelineSort(s)} style={{ padding: "5px 12px", borderRadius: "6px", background: pipelineSort === s ? "#1e3a5f" : "#111", border: `1px solid ${pipelineSort === s ? "#3b82f6" : "#333"}`, color: pipelineSort === s ? "#60a5fa" : "#666", cursor: "pointer", fontSize: "12px" }}>
                  {s === "score" ? "Score" : s === "date" ? "Date" : "Name"}
                </button>
              ))}
            </div>
            {pipeline.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px" }}>
                <div style={{ fontSize: "50px", marginBottom: "16px" }}>📭</div>
                <h3 style={{ color: "#555" }}>Pipeline is empty</h3>
                <p style={{ color: "#444", fontSize: "13px" }}>Go to Home and click "Add to Pipeline" on any guest card</p>
                <button onClick={() => setView("home")} style={{ marginTop: "16px", padding: "10px 24px", borderRadius: "8px", background: "linear-gradient(135deg,#7c3aed,#2563eb)", color: "#fff", border: "none", cursor: "pointer" }}>Go to Home</button>
              </div>
            ) : isMobile ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {filteredPipeline.map((g, i) => {
                  const realIndex = pipeline.findIndex(p => p.name === g.name)
                  const isCompared = !!comparedGuests.find(c => c.name === g.name)
                  return (
                    <div key={i} style={{ background: isCompared ? "#1a1a2e" : "#111827", borderRadius: "10px", padding: "14px", border: `1px solid ${isCompared ? "#7c3aed" : "#1f2937"}` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                        <div>
                          <div style={{ fontWeight: "bold", fontSize: "15px", color: "#fff" }}>{g.name}</div>
                          <span style={{ fontSize: "11px", background: "#1e1e3f", color: "#a78bfa", padding: "2px 8px", borderRadius: "20px" }}>{g.category}</span>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: "22px", fontWeight: "bold", color: priorityColor(g.priority) }}>{g.total}</div>
                          <div style={{ fontSize: "10px", color: priorityColor(g.priority) }}>{g.priority}</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "8px", marginBottom: "10px", flexWrap: "wrap" }}>
                        <select value={g.status} onChange={e => updatePipelineStatus(realIndex, e.target.value)} style={{ flex: 1, padding: "6px", borderRadius: "6px", background: "#1f2937", color: statusColor(g.status), border: `1px solid ${statusColor(g.status)}`, fontSize: "12px" }}>
                          <option value="New">New</option><option value="Contacted">Contacted</option><option value="Booked">Booked</option><option value="Declined">Declined</option>
                        </select>
                        <input type="date" value={g.recordingDate || ""} onChange={e => updateRecordingDate(realIndex, e.target.value)} style={{ flex: 1, padding: "6px", borderRadius: "6px", background: "#1f2937", color: g.recordingDate ? "#00ff88" : "#666", border: "1px solid #333", fontSize: "12px" }} />
                      </div>
                      <ActionButtons g={g} compact />
                      <div style={{ display: "flex", gap: "6px", marginTop: "8px" }}>
                        <button onClick={() => toggleCompare(g)} style={{ flex: 1, padding: "6px", borderRadius: "6px", background: isCompared ? "#1a3a2a" : "#1a1a2e", color: isCompared ? "#4ade80" : "#a78bfa", border: "none", cursor: "pointer", fontSize: "11px" }}>{isCompared ? "Comparing" : "Compare"}</button>
                        <button onClick={() => removeFromPipeline(realIndex)} style={{ flex: 1, padding: "6px", borderRadius: "6px", background: "#2a1a1a", color: "#f87171", border: "none", cursor: "pointer", fontSize: "11px" }}>Delete</button>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                  <thead>
                    <tr style={{ background: "#111827", borderBottom: "1px solid #333" }}>
                      {["Guest", "Category", "Score", "Priority", "Status", "Recording Date", "Notes", "Actions"].map(h => (
                        <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "#9ca3af", fontWeight: "600", whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPipeline.map((g, i) => {
                      const realIndex = pipeline.findIndex(p => p.name === g.name)
                      const isCompared = !!comparedGuests.find(c => c.name === g.name)
                      return (
                        <tr key={i} style={{ borderBottom: "1px solid #1f2937", background: isCompared ? "#1a1a2e" : i % 2 === 0 ? "#0d0d1a" : "#0a0a0f" }}>
                          <td style={{ padding: "14px 16px" }}>
                            <div style={{ fontWeight: "bold", color: "#fff", marginBottom: "2px" }}>{g.name}</div>
                            <div style={{ fontSize: "11px", color: "#555" }}>Added: {g.pipelineDate}</div>
                            {g.lastAppeared === "Never" && <span style={{ fontSize: "10px", color: "#00ff88" }}>First Time</span>}
                          </td>
                          <td style={{ padding: "14px 16px" }}><span style={{ background: "#1e1e3f", color: "#a78bfa", padding: "3px 10px", borderRadius: "20px", fontSize: "12px" }}>{g.category}</span></td>
                          <td style={{ padding: "14px 16px" }}><div style={{ fontSize: "20px", fontWeight: "bold", color: priorityColor(g.priority) }}>{g.total}</div></td>
                          <td style={{ padding: "14px 16px" }}><span style={{ color: priorityColor(g.priority), fontWeight: "bold", fontSize: "12px" }}>{g.priority}</span></td>
                          <td style={{ padding: "14px 16px" }}>
                            <select value={g.status} onChange={e => updatePipelineStatus(realIndex, e.target.value)} style={{ padding: "6px 10px", borderRadius: "6px", background: "#1f2937", color: statusColor(g.status), border: `1px solid ${statusColor(g.status)}`, fontSize: "12px", cursor: "pointer" }}>
                              <option value="New">New</option><option value="Contacted">Contacted</option><option value="Booked">Booked</option><option value="Declined">Declined</option>
                            </select>
                          </td>
                          <td style={{ padding: "14px 16px" }}>
                            <input type="date" value={g.recordingDate || ""} onChange={e => updateRecordingDate(realIndex, e.target.value)} style={{ padding: "6px", borderRadius: "6px", background: "#1f2937", color: g.recordingDate ? "#00ff88" : "#666", border: "1px solid #333", fontSize: "12px", cursor: "pointer" }} />
                          </td>
                          <td style={{ padding: "14px 16px", maxWidth: "180px" }}>
                            {notes[g.name] && notes[g.name].length > 0 && (
                              <div style={{ marginBottom: "6px" }}>
                                {notes[g.name].slice(-1).map((n, ni) => (
                                  <div key={ni} style={{ fontSize: "11px", color: "#9ca3af", background: "#1f2937", padding: "4px 8px", borderRadius: "4px", marginBottom: "2px" }}>
                                    <div>{n.text}</div><div style={{ color: "#555", fontSize: "10px" }}>{n.date}</div>
                                  </div>
                                ))}
                                {notes[g.name].length > 1 && <div style={{ fontSize: "10px", color: "#555" }}>+{notes[g.name].length - 1} more</div>}
                              </div>
                            )}
                            {editingNote === g.name ? (
                              <div>
                                <textarea value={noteText} onChange={e => setNoteText(e.target.value)} placeholder="Add note..." style={{ width: "100%", padding: "6px", borderRadius: "6px", background: "#1f2937", color: "#fff", border: "1px solid #333", fontSize: "12px", resize: "vertical", minHeight: "60px" }} />
                                <div style={{ display: "flex", gap: "4px", marginTop: "4px" }}>
                                  <button onClick={() => saveNote(g.name)} style={{ flex: 1, padding: "4px", borderRadius: "4px", background: "#166534", color: "#4ade80", border: "none", cursor: "pointer", fontSize: "11px" }}>Save</button>
                                  <button onClick={() => setEditingNote(null)} style={{ flex: 1, padding: "4px", borderRadius: "4px", background: "#333", color: "#aaa", border: "none", cursor: "pointer", fontSize: "11px" }}>Cancel</button>
                                </div>
                              </div>
                            ) : (
                              <button onClick={() => { setEditingNote(g.name); setNoteText("") }} style={{ padding: "4px 10px", borderRadius: "6px", background: "#1f2937", color: "#9ca3af", border: "1px solid #333", cursor: "pointer", fontSize: "11px" }}>Add Note</button>
                            )}
                          </td>
                          <td style={{ padding: "14px 16px" }}>
                            <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                              <button onClick={() => generateResearch(g)} style={{ padding: "5px 8px", borderRadius: "6px", background: "#1e3a5f", color: "#60a5fa", border: "none", cursor: "pointer", fontSize: "11px" }}>📋</button>
                              <button onClick={() => generateOutreach(g)} style={{ padding: "5px 8px", borderRadius: "6px", background: "#1a2e1a", color: "#4ade80", border: "none", cursor: "pointer", fontSize: "11px" }}>✉️</button>
                              <button onClick={() => generateQuestions(g)} style={{ padding: "5px 8px", borderRadius: "6px", background: "#2d1a3e", color: "#c084fc", border: "none", cursor: "pointer", fontSize: "11px" }}>❓</button>
                              <button onClick={() => { setSelectedGuest(g); generateWhatsapp(g); setView("whatsapp") }} style={{ padding: "5px 8px", borderRadius: "6px", background: "#1a2e1a", color: "#25d366", border: "none", cursor: "pointer", fontSize: "11px" }}>💬</button>
                              <button onClick={() => removeFromPipeline(realIndex)} style={{ padding: "5px 8px", borderRadius: "6px", background: "#2a1a1a", color: "#f87171", border: "none", cursor: "pointer", fontSize: "11px" }}>🗑️</button>
                              <button onClick={() => toggleCompare(g)} style={{ padding: "5px 8px", borderRadius: "6px", background: isCompared ? "#1a3a2a" : "#1a1a2e", color: isCompared ? "#4ade80" : "#a78bfa", border: "none", cursor: "pointer", fontSize: "11px" }}>{isCompared ? "✓" : "⚖️"}</button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* PLANNER VIEW */}
        {view === "planner" && (
<div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
  <h2 style={{ color: "#4ade80", marginBottom: "8px" }}>📅 Content Calendar Intelligence</h2>
  <p style={{ color: "#888", marginBottom: "24px" }}>Editorial command center — plan, track, and optimize your content schedule.</p>
  <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: "12px", marginBottom: "24px" }}>
    {[["📅 Month", new Date(plannerMonth).toLocaleString("default", { month: "long", year: "numeric" })], ["🎙️ Episodes", calendarEpisodes.length], ["✅ Published", calendarEpisodes.filter(e => e.status === "Published").length], ["⚠️ Empty Slots", Math.max(0, 8 - calendarEpisodes.length)]].map(([label, val]) => (
      <div key={label} style={{ background: "#1a1a2e", borderRadius: "10px", padding: "16px", textAlign: "center", border: "1px solid #333" }}>
        <div style={{ fontSize: "20px", fontWeight: "bold", color: "#4ade80" }}>{val}</div>
        <div style={{ color: "#888", fontSize: "12px", marginTop: "4px" }}>{label}</div>
      </div>
    ))}
  </div>
  <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap", alignItems: "center" }}>
    <button onClick={() => setPlannerMonth(new Date(plannerMonth.getFullYear(), plannerMonth.getMonth() - 1, 1))} style={{ padding: "8px 16px", borderRadius: "8px", background: "#1a1a2e", color: "#fff", border: "1px solid #333", cursor: "pointer" }}>← Prev</button>
    <span style={{ color: "#fff", fontWeight: "bold", fontSize: "16px" }}>{plannerMonth.toLocaleString("default", { month: "long", year: "numeric" })}</span>
    <button onClick={() => setPlannerMonth(new Date(plannerMonth.getFullYear(), plannerMonth.getMonth() + 1, 1))} style={{ padding: "8px 16px", borderRadius: "8px", background: "#1a1a2e", color: "#fff", border: "1px solid #333", cursor: "pointer" }}>Next →</button>
    <button onClick={() => setShowAddEpisode(!showAddEpisode)} style={{ padding: "8px 16px", borderRadius: "8px", background: "#4ade80", color: "#000", border: "none", cursor: "pointer", fontWeight: "bold" }}>+ Add Episode</button>
    {calendarEpisodes.length > 0 && <button onClick={generateCalendarIntelligence} disabled={loadingCalendarIntel} style={{ padding: "8px 16px", borderRadius: "8px", background: "#7c3aed", color: "#fff", border: "none", cursor: "pointer", fontWeight: "bold" }}>{loadingCalendarIntel ? "⏳ Analyzing..." : "🧠 Get Intelligence"}</button>}
  </div>
  {showAddEpisode && (
    <div style={{ background: "#1a1a2e", border: "1px solid #4ade80", borderRadius: "12px", padding: "20px", marginBottom: "24px" }}>
      <h3 style={{ color: "#4ade80", marginBottom: "16px" }}>➕ Add New Episode</h3>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: "12px" }}>
        {[["Guest Name", "guest", "text", "e.g. Deepinder Goyal"], ["Topic", "topic", "text", "e.g. Building Zomato"], ["Category", "category", "text", "e.g. Entrepreneurship"], ["Record Date", "recordDate", "date", ""], ["Publish Date", "publishDate", "date", ""], ["Sponsor", "sponsor", "text", "e.g. Zepto"], ["Team Owner", "owner", "text", "e.g. Priya"], ["Notes", "notes", "text", "Any notes"]].map(([label, field, type, placeholder]) => (
          <div key={field}>
            <label style={{ color: "#ccc", fontSize: "12px", display: "block", marginBottom: "4px" }}>{label}</label>
            <input type={type} value={newEpisode[field]} onChange={e => setNewEpisode(prev => ({ ...prev, [field]: e.target.value }))} placeholder={placeholder} style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", background: "#0d0900", color: "#fff", border: "1px solid #333", boxSizing: "border-box" }} />
          </div>
        ))}
        <div>
          <label style={{ color: "#ccc", fontSize: "12px", display: "block", marginBottom: "4px" }}>Status</label>
          <select value={newEpisode.status} onChange={e => setNewEpisode(prev => ({ ...prev, status: e.target.value }))} style={{ width: "100%", padding: "8px", borderRadius: "6px", background: "#0d0900", color: "#fff", border: "1px solid #333" }}>
            {["Booked", "Recorded", "Editing", "Ready", "Published"].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label style={{ color: "#ccc", fontSize: "12px", display: "block", marginBottom: "4px" }}>Priority</label>
          <select value={newEpisode.priority} onChange={e => setNewEpisode(prev => ({ ...prev, priority: e.target.value }))} style={{ width: "100%", padding: "8px", borderRadius: "6px", background: "#0d0900", color: "#fff", border: "1px solid #333" }}>
            {["High", "Medium", "Low"].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
        <button onClick={() => { if (!newEpisode.guest) { alert("Guest name required!"); return } setCalendarEpisodes(prev => [...prev, { ...newEpisode, id: Date.now() }]); setNewEpisode({ guest: "", topic: "", category: "", recordDate: "", publishDate: "", status: "Booked", priority: "Medium", sponsor: "", owner: "", notes: "" }); setShowAddEpisode(false) }} style={{ padding: "10px 24px", borderRadius: "8px", background: "#4ade80", color: "#000", border: "none", cursor: "pointer", fontWeight: "bold" }}>Save Episode</button>
        <button onClick={() => setShowAddEpisode(false)} style={{ padding: "10px 24px", borderRadius: "8px", background: "#333", color: "#fff", border: "none", cursor: "pointer" }}>Cancel</button>
      </div>
    </div>
  )}
  {calendarEpisodes.length === 0 && !showAddEpisode && (
    <div style={{ textAlign: "center", padding: "60px", background: "#1a1a2e", borderRadius: "12px", color: "#555" }}>
      <div style={{ fontSize: "48px", marginBottom: "16px" }}>📅</div>
      <p>No episodes planned yet. Click + Add Episode to start building your calendar.</p>
    </div>
  )}
  {calendarEpisodes.length > 0 && (
    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "12px", marginBottom: "24px" }}>
      {calendarEpisodes.map((ep, i) => (
        <div key={ep.id} style={{ background: "#1a1a2e", border: `1px solid ${ep.status === "Published" ? "#4ade80" : ep.status === "Ready" ? "#60a5fa" : ep.status === "Recorded" ? "#a78bfa" : "#f59e0b"}44`, borderRadius: "10px", padding: "14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontWeight: "bold", color: "#fff", fontSize: "14px" }}>{ep.guest}</span>
            <div style={{ display: "flex", gap: "6px" }}>
              <span style={{ background: ep.status === "Published" ? "#4ade8020" : ep.status === "Ready" ? "#60a5fa20" : ep.status === "Recorded" ? "#a78bfa20" : "#f59e0b20", color: ep.status === "Published" ? "#4ade80" : ep.status === "Ready" ? "#60a5fa" : ep.status === "Recorded" ? "#a78bfa" : "#f59e0b", padding: "2px 8px", borderRadius: "4px", fontSize: "11px" }}>{ep.status}</span>
              <span style={{ background: ep.priority === "High" ? "#ef444420" : "#33333320", color: ep.priority === "High" ? "#ef4444" : "#888", padding: "2px 8px", borderRadius: "4px", fontSize: "11px" }}>{ep.priority}</span>
            </div>
          </div>
          <p style={{ color: "#888", fontSize: "12px", marginBottom: "6px" }}>🎯 {ep.topic} • {ep.category}</p>
          {ep.recordDate && <p style={{ color: "#666", fontSize: "11px", marginBottom: "2px" }}>🎙️ Record: {ep.recordDate}</p>}
          {ep.publishDate && <p style={{ color: "#666", fontSize: "11px", marginBottom: "2px" }}>📢 Publish: {ep.publishDate}</p>}
          {ep.sponsor && <p style={{ color: "#666", fontSize: "11px", marginBottom: "2px" }}>💰 Sponsor: {ep.sponsor}</p>}
          {ep.owner && <p style={{ color: "#666", fontSize: "11px", marginBottom: "6px" }}>👤 Owner: {ep.owner}</p>}
          <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
            <select value={ep.status} onChange={e => setCalendarEpisodes(prev => prev.map((x, xi) => xi === i ? { ...x, status: e.target.value } : x))} style={{ flex: 1, padding: "4px", borderRadius: "4px", background: "#0d0900", color: "#fff", border: "1px solid #333", fontSize: "11px" }}>
              {["Booked", "Recorded", "Editing", "Ready", "Published"].map(s => <option key={s}>{s}</option>)}
            </select>
            <button onClick={() => setCalendarEpisodes(prev => prev.filter((_, xi) => xi !== i))} style={{ padding: "4px 10px", borderRadius: "4px", background: "#2a1a1a", color: "#f87171", border: "1px solid #7f1d1d", cursor: "pointer", fontSize: "11px" }}>Remove</button>
          </div>
        </div>
      ))}
    </div>
  )}
  {calendarIntel && (
    <div>
      <h3 style={{ color: "#4ade80", marginBottom: "16px" }}>🧠 Monthly Intelligence Report</h3>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(5, 1fr)", gap: "12px", marginBottom: "16px" }}>
        {[["Content Mix", calendarIntel.contentMixScore], ["Topic Diversity", calendarIntel.topicDiversityScore], ["Guest Pacing", calendarIntel.guestPacingScore], ["Sponsor Align", calendarIntel.sponsorAlignmentScore], ["Overall Health", calendarIntel.overallHealthScore]].map(([label, score]) => (
          <div key={label} style={{ background: "#1a1a2e", borderRadius: "10px", padding: "14px", textAlign: "center", border: `1px solid ${score >= 70 ? "#4ade80" : score >= 50 ? "#f59e0b" : "#ef4444"}44` }}>
            <div style={{ fontSize: "24px", fontWeight: "bold", color: score >= 70 ? "#4ade80" : score >= 50 ? "#f59e0b" : "#ef4444" }}>{score}</div>
            <div style={{ color: "#888", fontSize: "11px", marginTop: "4px" }}>{label}</div>
          </div>
        ))}
      </div>
      {calendarIntel.alerts?.length > 0 && (
        <div style={{ marginBottom: "16px" }}>
          {calendarIntel.alerts.map((a, i) => <div key={i} style={{ background: a.type === "danger" ? "#ef444415" : a.type === "warning" ? "#f59e0b15" : "#4ade8015", border: `1px solid ${a.type === "danger" ? "#ef4444" : a.type === "warning" ? "#f59e0b" : "#4ade80"}44`, borderRadius: "8px", padding: "10px 14px", marginBottom: "8px", color: a.type === "danger" ? "#ef4444" : a.type === "warning" ? "#f59e0b" : "#4ade80", fontSize: "13px" }}>{a.type === "danger" ? "🔴" : a.type === "warning" ? "⚠️" : "✅"} {a.message}</div>)}
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
        <div style={{ background: "#1a1a2e", border: "1px solid #333", borderRadius: "12px", padding: "20px" }}>
          <h4 style={{ color: "#4ade80", marginBottom: "12px" }}>📋 Best Publish Sequence</h4>
          {calendarIntel.bestPublishSequence?.map((s, i) => <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "8px" }}><span style={{ background: "#4ade8020", color: "#4ade80", padding: "2px 8px", borderRadius: "4px", fontSize: "11px" }}>#{i + 1}</span><span style={{ color: "#ccc", fontSize: "12px" }}>{s}</span></div>)}
        </div>
        <div style={{ background: "#1a1a2e", border: "1px solid #333", borderRadius: "12px", padding: "20px" }}>
          <h4 style={{ color: "#4ade80", marginBottom: "12px" }}>🚀 Growth Opportunities</h4>
          {calendarIntel.growthOpportunities?.map((o, i) => <div key={i} style={{ background: "#4ade8010", padding: "8px 12px", borderRadius: "6px", marginBottom: "8px", color: "#ccc", fontSize: "12px" }}>💡 {o}</div>)}
        </div>
      </div>
      <div style={{ background: "#1a1a2e", border: "2px solid #4ade80", borderRadius: "12px", padding: "20px" }}>
        <h4 style={{ color: "#4ade80", marginBottom: "8px" }}>📊 Monthly Strategy Recommendation</h4>
        <p style={{ color: "#ccc", fontSize: "13px", lineHeight: "1.7" }}>{calendarIntel.monthlyRecommendation}</p>
      </div>
    </div>
  )}
</div>
)}
        {/* COMPARE VIEW */}
        {view === "compare" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <h2 style={{ margin: "0 0 4px", color: "#a78bfa" }}>⚖️ Guest Comparison</h2>
                <p style={{ margin: 0, fontSize: "12px", color: "#555" }}>Side by side — decide who to prioritize</p>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={() => setView("home")} style={{ padding: "8px 16px", borderRadius: "8px", background: "#111", color: "#666", border: "1px solid #333", cursor: "pointer", fontSize: "13px" }}>← Back</button>
                <button onClick={() => { setComparedGuests([]); setView("home") }} style={{ padding: "8px 16px", borderRadius: "8px", background: "#2a1a1a", color: "#f87171", border: "1px solid #7f1d1d", cursor: "pointer", fontSize: "13px" }}>Clear All</button>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : `repeat(${comparedGuests.length}, 1fr)`, gap: "14px" }}>
              {comparedGuests.map((g, i) => (
                <div key={i} style={{ background: "#111827", borderRadius: "12px", border: `1px solid ${priorityColor(g.priority)}44`, overflow: "hidden" }}>
                  <div style={{ background: `linear-gradient(135deg,${priorityColor(g.priority)}22,#111827)`, padding: "18px", borderBottom: "1px solid #1f2937", textAlign: "center" }}>
                    <div style={{ fontSize: "30px", fontWeight: "bold", color: priorityColor(g.priority), marginBottom: "4px" }}>{g.total}</div>
                    <div style={{ fontSize: "11px", color: priorityColor(g.priority), fontWeight: "bold", marginBottom: "8px" }}>{g.priority} Priority</div>
                    <h3 style={{ margin: "0 0 6px", fontSize: "16px", color: "#fff" }}>{g.name}</h3>
                    <span style={{ fontSize: "12px", background: "#1e1e3f", color: "#a78bfa", padding: "3px 10px", borderRadius: "20px" }}>{g.category}</span>
                  </div>
                  <div style={{ padding: "14px", borderBottom: "1px solid #1f2937" }}>
                    {[{ label: "Virality", val: g.virality }, { label: "Relevance", val: g.relevance }, { label: "Value", val: g.value }].map(s => (
                      <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                        <span style={{ fontSize: "12px", color: "#9ca3af", minWidth: "65px" }}>{s.label}</span>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1 }}>
                          <div style={{ flex: 1, height: "6px", background: "#1f2937", borderRadius: "3px", overflow: "hidden" }}>
                            <div style={{ width: `${s.val * 10}%`, height: "100%", background: s.val >= 8 ? "#00ff88" : s.val >= 6 ? "#ffaa00" : "#ff6666", borderRadius: "3px" }} />
                          </div>
                          <span style={{ fontSize: "14px", fontWeight: "bold", color: s.val >= 8 ? "#00ff88" : s.val >= 6 ? "#ffaa00" : "#ff6666", minWidth: "18px", textAlign: "right" }}>{s.val}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ padding: "14px", borderBottom: "1px solid #1f2937" }}>
                    <div style={{ fontSize: "11px", color: "#f59e0b", fontWeight: "bold", marginBottom: "6px" }}>WHY NOW</div>
                    <p style={{ margin: 0, fontSize: "12px", color: "#9ca3af", lineHeight: "1.6" }}>{g.whyNow}</p>
                  </div>
                  <div style={{ padding: "14px", borderBottom: "1px solid #1f2937" }}>
                    <div style={{ fontSize: "11px", color: "#60a5fa", fontWeight: "bold", marginBottom: "6px" }}>TOPIC ANGLE</div>
                    <p style={{ margin: 0, fontSize: "12px", color: "#9ca3af", lineHeight: "1.6" }}>{g.topicAngle}</p>
                  </div>
                  <div style={{ padding: "14px", display: "flex", flexDirection: "column", gap: "6px" }}>
                    <button onClick={() => generateResearch(g)} style={{ width: "100%", padding: "9px", borderRadius: "8px", background: "#1e3a5f", color: "#60a5fa", border: "1px solid #1e40af", cursor: "pointer", fontSize: "13px" }}>📋 Research</button>
                    <button onClick={() => generateOutreach(g)} style={{ width: "100%", padding: "9px", borderRadius: "8px", background: "#1a2e1a", color: "#4ade80", border: "1px solid #166534", cursor: "pointer", fontSize: "13px" }}>✉️ Outreach</button>
                    <button onClick={() => generateQuestions(g)} style={{ width: "100%", padding: "9px", borderRadius: "8px", background: "#2d1a3e", color: "#c084fc", border: "1px solid #6b21a8", cursor: "pointer", fontSize: "13px" }}>❓ Questions</button>
                    <button onClick={() => { setSelectedGuest(g); generateWhatsapp(g); setView("whatsapp") }} style={{ width: "100%", padding: "9px", borderRadius: "8px", background: "#1a2e1a", color: "#25d366", border: "1px solid #128c7e", cursor: "pointer", fontSize: "13px" }}>💬 WhatsApp</button>
                    <button onClick={() => toggleCompare(g)} style={{ width: "100%", padding: "9px", borderRadius: "8px", background: "#2a1a1a", color: "#f87171", border: "1px solid #7f1d1d", cursor: "pointer", fontSize: "13px" }}>✕ Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {showIntel && (
  <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.85)", zIndex: 1000, overflowY: "auto", padding: "20px" }}>
    <div style={{ maxWidth: "800px", margin: "0 auto", background: darkMode ? "#0f172a" : "#fff", borderRadius: "16px", padding: "28px", border: "1px solid #1e3a5f" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2 style={{ color: "#38bdf8", margin: 0 }}>📋 Intelligence Brief: {intelGuest?.name}</h2>
        <button onClick={() => setShowIntel(false)} style={{ background: "#7f1d1d", color: "#fff", border: "none", borderRadius: "8px", padding: "6px 14px", cursor: "pointer" }}>✕ Close</button>
      </div>

      {intelLoading && <div style={{ textAlign: "center", padding: "60px", color: "#38bdf8" }}>⏳ Generating intelligence brief...</div>}

      {intelData && (
        <div>
          {/* Executive Summary */}
          <div style={{ background: darkMode ? "#1e3a5f" : "#eff6ff", borderRadius: "10px", padding: "16px", marginBottom: "16px" }}>
            <h3 style={{ color: "#38bdf8", margin: "0 0 8px" }}>📌 Executive Summary</h3>
            <p style={{ color: darkMode ? "#fff" : "#000", margin: 0, lineHeight: "1.6" }}>{intelData.executive_summary}</p>
          </div>

          {/* Why Raj */}
          <div style={{ background: darkMode ? "#1a2e1a" : "#f0fdf4", borderRadius: "10px", padding: "16px", marginBottom: "16px", border: "1px solid #166534" }}>
            <h3 style={{ color: "#4ade80", margin: "0 0 8px" }}>🎯 Why Raj Should Have This Guest</h3>
            <p style={{ color: darkMode ? "#fff" : "#000", margin: 0, lineHeight: "1.6" }}>{intelData.why_raj}</p>
          </div>

          {/* Why Now */}
          <div style={{ background: darkMode ? "#1a1a0a" : "#fffbeb", borderRadius: "10px", padding: "16px", marginBottom: "16px", border: "1px solid #854d0e" }}>
            <h3 style={{ color: "#f59e0b", margin: "0 0 8px" }}>⚡ Why Now</h3>
            <p style={{ color: darkMode ? "#fff" : "#000", margin: 0 }}>{intelData.why_now}</p>
          </div>

          {/* Achievements */}
          <div style={{ marginBottom: "16px" }}>
            <h3 style={{ color: "#38bdf8", marginBottom: "10px" }}>🏆 Key Achievements</h3>
            {intelData.achievements?.map((a, i) => (
              <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start", marginBottom: "8px", background: darkMode ? "#111827" : "#f8fafc", borderRadius: "8px", padding: "10px" }}>
                <span style={{ color: a.tag === "verified" ? "#4ade80" : "#f59e0b", fontSize: "11px", whiteSpace: "nowrap", marginTop: "2px" }}>{a.tag === "verified" ? "✅ Verified" : "🔵 Inferred"}</span>
                <div>
                  <p style={{ color: darkMode ? "#fff" : "#000", margin: "0 0 2px", fontSize: "14px" }}>{a.fact}</p>
                  <p style={{ color: "#666", fontSize: "11px", margin: 0 }}>Source: {a.source}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Risks */}
          {intelData.risks?.length > 0 && (
            <div style={{ marginBottom: "16px" }}>
              <h3 style={{ color: "#f87171", marginBottom: "10px" }}>⚠️ Risk & Sensitivity Flags</h3>
              {intelData.risks.map((r, i) => (
                <div key={i} style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "6px", background: darkMode ? "#1a0a0a" : "#fff1f2", borderRadius: "8px", padding: "10px" }}>
                  <span style={{ color: r.severity === "high" ? "#f87171" : r.severity === "medium" ? "#f59e0b" : "#888", fontSize: "11px" }}>{r.severity?.toUpperCase()}</span>
                  <p style={{ color: darkMode ? "#fff" : "#000", margin: 0, fontSize: "14px" }}>{r.flag}</p>
                </div>
              ))}
            </div>
          )}

          {/* Audience Fit + Episode Angle */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
            <div style={{ background: darkMode ? "#111827" : "#f8fafc", borderRadius: "10px", padding: "14px" }}>
              <h3 style={{ color: "#a78bfa", margin: "0 0 8px", fontSize: "14px" }}>👥 Audience Fit</h3>
              <p style={{ color: darkMode ? "#ccc" : "#333", margin: 0, fontSize: "13px" }}>{intelData.audience_fit}</p>
            </div>
            <div style={{ background: darkMode ? "#111827" : "#f8fafc", borderRadius: "10px", padding: "14px" }}>
              <h3 style={{ color: "#f59e0b", margin: "0 0 8px", fontSize: "14px" }}>🎬 Best Episode Angle</h3>
              <p style={{ color: darkMode ? "#ccc" : "#333", margin: 0, fontSize: "13px" }}>{intelData.episode_angle}</p>
            </div>
          </div>

          {/* Intro Hook */}
          <div style={{ background: darkMode ? "#0f2027" : "#f0f9ff", borderRadius: "10px", padding: "14px", marginBottom: "16px", border: "1px solid #0369a1" }}>
            <h3 style={{ color: "#38bdf8", margin: "0 0 8px", fontSize: "14px" }}>🎤 Suggested Intro Hook</h3>
            <p style={{ color: darkMode ? "#ccc" : "#333", margin: 0, fontStyle: "italic" }}>{intelData.intro_hook}</p>
          </div>

          {/* Questions */}
          <div style={{ marginBottom: "16px" }}>
            <h3 style={{ color: "#38bdf8", marginBottom: "10px" }}>❓ Interview Questions</h3>
            {intelData.questions?.map((q, i) => (
              <div key={i} style={{ background: darkMode ? "#111827" : "#f8fafc", borderRadius: "8px", padding: "10px 14px", marginBottom: "6px", color: darkMode ? "#fff" : "#000", fontSize: "14px" }}>
                {i + 1}. {q}
              </div>
            ))}
          </div>

          {/* Sponsor Fit */}
          <div style={{ background: darkMode ? "#1a1200" : "#fffbeb", borderRadius: "10px", padding: "14px", marginBottom: "16px" }}>
            <h3 style={{ color: "#f59e0b", margin: "0 0 8px", fontSize: "14px" }}>💰 Sponsor Fit</h3>
            <p style={{ color: darkMode ? "#ccc" : "#333", margin: 0, fontSize: "13px" }}>{intelData.sponsor_fit}</p>
          </div>

          {/* Sources */}
          <div style={{ background: darkMode ? "#111827" : "#f8fafc", borderRadius: "10px", padding: "14px" }}>
            <h3 style={{ color: "#888", margin: "0 0 8px", fontSize: "13px" }}>🔗 Sources</h3>
            {intelData.sources?.map((s, i) => (
              <p key={i} style={{ color: "#38bdf8", margin: "2px 0", fontSize: "12px" }}>• {s}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
)}

        {/* QUESTIONS VIEW */}
        {view === "questions" && (
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <button onClick={() => setView("home")} style={{ marginBottom: "20px", padding: "8px 16px", borderRadius: "8px", background: "#1e1e3f", color: "#a78bfa", border: "1px solid #4c1d95", cursor: "pointer" }}>← Back</button>
            <h2 style={{ color: "#a78bfa" }}>❓ 20 Questions: {selectedGuest?.name}</h2>
            {loading ? <div style={{ textAlign: "center", padding: "60px", color: "#666" }}>⏳ Generating questions...</div>
              : <div style={{ background: "#111827", borderRadius: "12px", padding: "24px", border: "1px solid #333", whiteSpace: "pre-wrap", lineHeight: "1.9", color: "#d1d5db", fontSize: "14px" }}>
                {questions}
                <div style={{ marginTop: "20px", borderTop: "1px solid #333", paddingTop: "20px" }}>
                  <button onClick={() => navigator.clipboard.writeText(questions)} style={{ padding: "10px 20px", borderRadius: "8px", background: "#1e3a5f", color: "#60a5fa", border: "1px solid #1e40af", cursor: "pointer" }}>📋 Copy Questions</button>
                </div>
              </div>}
          </div>
        )}

        {/* OUTREACH VIEW */}
        {view === "outreach" && (
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <button onClick={() => setView("home")} style={{ marginBottom: "20px", padding: "8px 16px", borderRadius: "8px", background: "#1e1e3f", color: "#a78bfa", border: "1px solid #4c1d95", cursor: "pointer" }}>← Back</button>
            <h2 style={{ color: "#a78bfa" }}>✉️ Outreach: {selectedGuest?.name}</h2>
            {loading ? <div style={{ textAlign: "center", padding: "60px", color: "#666" }}>⏳ Generating outreach email...</div> : (
              <div>
                <div style={{ background: "#111827", borderRadius: "12px", padding: "20px", border: "1px solid #1e3a5f", marginBottom: "12px" }}>
                  <label style={{ fontSize: "12px", color: "#60a5fa", fontWeight: "bold", display: "block", marginBottom: "8px" }}>📬 Recipient Email Address</label>
                  <input type="email" placeholder="Enter guest's email or management contact" value={outreach.recipientEmail} onChange={e => setOutreach(prev => ({ ...prev, recipientEmail: e.target.value }))}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", background: "#1f2937", color: "#fff", border: `1px solid ${outreach.recipientEmail ? "#3b82f6" : "#374151"}`, fontSize: "13px", boxSizing: "border-box", outline: "none" }} />
                </div>
                <div style={{ background: "#111827", borderRadius: "12px", padding: "20px", border: "1px solid #333", marginBottom: "12px" }}>
                  <label style={{ fontSize: "12px", color: "#9ca3af", fontWeight: "bold", display: "block", marginBottom: "8px" }}>📌 Subject Line</label>
                  <div style={{ fontSize: "14px", color: "#f3f4f6", fontWeight: "600", background: "#1f2937", padding: "10px 14px", borderRadius: "8px" }}>{outreach.subject || "—"}</div>
                </div>
                <div style={{ background: "#111827", borderRadius: "12px", padding: "20px", border: "1px solid #333", marginBottom: "16px" }}>
                  <label style={{ fontSize: "12px", color: "#9ca3af", fontWeight: "bold", display: "block", marginBottom: "8px" }}>📝 Email Body</label>
                  <div style={{ whiteSpace: "pre-wrap", lineHeight: "1.8", color: "#d1d5db", fontSize: "14px" }}>{outreach.body || "—"}</div>
                </div>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "12px" }}>
                  <button onClick={openInGmail} style={{ flex: 2, padding: "12px 20px", borderRadius: "10px", background: "linear-gradient(135deg,#1a3a1a,#14532d)", color: "#4ade80", border: "1px solid #166534", cursor: "pointer", fontSize: "14px", fontWeight: "bold" }}>📧 Open in Gmail</button>
                  <button onClick={copyEmailBody} style={{ flex: 1, padding: "12px 20px", borderRadius: "10px", background: copiedEmail ? "#1a3a1a" : "#1e3a5f", color: copiedEmail ? "#4ade80" : "#60a5fa", border: `1px solid ${copiedEmail ? "#166534" : "#1e40af"}`, cursor: "pointer", fontSize: "13px", fontWeight: "bold" }}>{copiedEmail ? "✅ Copied!" : "📋 Copy Email"}</button>
                </div>
                <button onClick={() => { generateWhatsapp(selectedGuest); setView("whatsapp") }} style={{ width: "100%", padding: "12px", borderRadius: "10px", background: "linear-gradient(135deg,#1a2e1a,#14532d)", color: "#25d366", border: "1px solid #128c7e", cursor: "pointer", fontSize: "14px", fontWeight: "bold" }}>💬 Switch to WhatsApp Message Instead</button>
              </div>
            )}
          </div>
        )}

        {/* WHATSAPP VIEW */}
        {view === "whatsapp" && (
          <div style={{ maxWidth: "600px", margin: "0 auto" }}>
            <button onClick={() => setView("home")} style={{ marginBottom: "20px", padding: "8px 16px", borderRadius: "8px", background: "#1e1e3f", color: "#a78bfa", border: "1px solid #4c1d95", cursor: "pointer" }}>← Back</button>
            <h2 style={{ color: "#25d366" }}>💬 WhatsApp Message: {selectedGuest?.name}</h2>
            {loadingWhatsapp ? <div style={{ textAlign: "center", padding: "60px", color: "#666" }}>⏳ Generating WhatsApp message...</div> : (
              <div>
                <div style={{ background: "#0d1117", borderRadius: "12px", padding: "20px", marginBottom: "16px", border: "1px solid #1f2937" }}>
                  <div style={{ fontSize: "12px", color: "#555", marginBottom: "10px" }}>Preview</div>
                  <div style={{ background: "#1a2e1a", borderRadius: "12px 12px 12px 0", padding: "14px 16px", maxWidth: "85%", border: "1px solid #166534" }}>
                    <div style={{ fontSize: "13px", color: "#dcf8c6", lineHeight: "1.6", whiteSpace: "pre-wrap" }}>{whatsappMsg || "—"}</div>
                    <div style={{ fontSize: "10px", color: "#4ade80", marginTop: "6px", textAlign: "right" }}>Raj Shamani's Team ✓✓</div>
                  </div>
                </div>
                <div style={{ background: "#111827", borderRadius: "12px", padding: "20px", border: "1px solid #333", marginBottom: "16px" }}>
                  <label style={{ fontSize: "12px", color: "#9ca3af", fontWeight: "bold", display: "block", marginBottom: "8px" }}>✏️ Edit Message</label>
                  <textarea value={whatsappMsg} onChange={e => setWhatsappMsg(e.target.value)} rows={6}
                    style={{ width: "100%", padding: "12px", borderRadius: "8px", background: "#1f2937", color: "#fff", border: "1px solid #374151", fontSize: "13px", resize: "vertical", boxSizing: "border-box", outline: "none", lineHeight: "1.6" }} />
                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "6px" }}>
                    <button onClick={() => generateWhatsapp(selectedGuest)} style={{ padding: "5px 12px", borderRadius: "6px", background: "#1f2937", color: "#9ca3af", border: "1px solid #333", cursor: "pointer", fontSize: "12px" }}>Regenerate</button>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "12px" }}>
                  <button onClick={openInWhatsApp} style={{ flex: 2, padding: "13px 20px", borderRadius: "10px", background: "linear-gradient(135deg,#128c7e,#25d366)", color: "#fff", border: "none", cursor: "pointer", fontSize: "14px", fontWeight: "bold" }}>💬 Open in WhatsApp</button>
                  <button onClick={copyWhatsApp} style={{ flex: 1, padding: "13px 20px", borderRadius: "10px", background: copiedWA ? "#1a3a2a" : "#1f2937", color: copiedWA ? "#4ade80" : "#9ca3af", border: `1px solid ${copiedWA ? "#166534" : "#333"}`, cursor: "pointer", fontSize: "13px", fontWeight: "bold" }}>{copiedWA ? "✅ Copied!" : "📋 Copy"}</button>
                </div>
                <button onClick={() => generateOutreach(selectedGuest)} style={{ width: "100%", marginTop: "12px", padding: "12px", borderRadius: "10px", background: "#1e3a5f", color: "#60a5fa", border: "1px solid #1e40af", cursor: "pointer", fontSize: "13px" }}>✉️ Switch to Email Outreach Instead</button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* COMPETITORS VIEW */}
      {view === "competitors" && (
<div style={{ padding: isMobile ? "14px" : "24px", maxWidth: "1300px", margin: "0 auto" }}>
  <h2 style={{ color: "#818cf8", marginBottom: "8px" }}>🏆 Competitor Intelligence V2</h2>
  <p style={{ color: "#888", marginBottom: "24px" }}>Full competitive strategy dashboard — who's winning, where are the gaps, what Raj should do next.</p>
  <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
    <button onClick={fetchCompetitors} disabled={loadingCompetitors} style={{ padding: "10px 24px", borderRadius: "8px", background: "#3730a3", color: "#fff", border: "none", cursor: "pointer", fontWeight: "bold" }}>
      {loadingCompetitors ? "⏳ Loading..." : "🔄 Load Competitor Profiles"}
    </button>
    {competitors.length > 0 && (
      <button onClick={analyzeCompetitorGaps} disabled={loadingCompetitorGaps} style={{ padding: "10px 24px", borderRadius: "8px", background: "#7c3aed", color: "#fff", border: "none", cursor: "pointer", fontWeight: "bold" }}>
        {loadingCompetitorGaps ? "⏳ Analyzing..." : "🔍 Find Gap Opportunities"}
      </button>
    )}
  </div>
  {competitors.length > 0 && (
    <div style={{ marginBottom: "24px" }}>
      <h3 style={{ color: "#818cf8", marginBottom: "12px" }}>Select Competitors to Analyze</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {competitors.map((c, i) => (
          <label key={i} style={{ display: "flex", alignItems: "center", gap: "6px", background: selectedCompetitors.includes(c.host) ? "#3730a3" : "#1a1a2e", padding: "6px 14px", borderRadius: "20px", cursor: "pointer", color: selectedCompetitors.includes(c.host) ? "#fff" : "#888", fontSize: "13px", border: `1px solid ${selectedCompetitors.includes(c.host) ? "#818cf8" : "#333"}` }}>
            <input type="checkbox" checked={selectedCompetitors.includes(c.host)} onChange={() => setSelectedCompetitors(prev => prev.includes(c.host) ? prev.filter(x => x !== c.host) : [...prev, c.host])} style={{ display: "none" }} />
            {c.host}
          </label>
        ))}
      </div>
    </div>
  )}
  {loadingCompetitors && <div style={{ textAlign: "center", padding: "60px", color: "#666" }}><div style={{ fontSize: "40px", marginBottom: "16px" }}>🔍</div><p>Loading competitor profiles...</p></div>}
  {!loadingCompetitors && competitors.length === 0 && (
    <div style={{ textAlign: "center", padding: "60px", color: "#555", background: "#111827", borderRadius: "12px" }}>
      <div style={{ fontSize: "50px", marginBottom: "16px" }}>🏆</div>
      <h3>No data loaded yet</h3>
      <button onClick={fetchCompetitors} style={{ marginTop: "16px", padding: "10px 24px", borderRadius: "8px", background: "#3730a3", color: "#fff", border: "none", cursor: "pointer" }}>Load Competitor Data</button>
    </div>
  )}
  {competitors.length > 0 && (
    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(340px, 1fr))", gap: "16px", marginBottom: "32px" }}>
      {competitors.map((comp, ci) => (
        <div key={ci} onClick={() => setSelectedCompetitorProfile(selectedCompetitorProfile === ci ? null : ci)} style={{ background: "#111827", borderRadius: "12px", border: `1px solid ${selectedCompetitors.includes(comp.host) ? "#818cf8" : "#333"}`, cursor: "pointer", overflow: "hidden" }}>
          <div style={{ padding: "16px", background: "#0d0d1a" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <h3 style={{ color: "#fff", margin: 0, fontSize: "15px" }}>{comp.host}</h3>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ color: comp.momentumTrend === "Rising" ? "#22c55e" : comp.momentumTrend === "Declining" ? "#ef4444" : "#f59e0b", fontSize: "12px" }}>{comp.momentumTrend === "Rising" ? "↑" : comp.momentumTrend === "Declining" ? "↓" : "→"}</span>
                <span style={{ background: "#3730a3", color: "#818cf8", padding: "2px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: "bold" }}>{comp.momentumScore}/10</span>
              </div>
            </div>
            <p style={{ color: "#888", fontSize: "12px", margin: "0 0 8px" }}>{comp.positioning}</p>
            <p style={{ color: "#666", fontSize: "11px", margin: "0 0 8px" }}>👥 {comp.audienceType}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "8px" }}>
              {comp.contentPillars?.map((p, i) => <span key={i} style={{ background: "#1e1e3f", color: "#a78bfa", padding: "2px 8px", borderRadius: "10px", fontSize: "11px" }}>{p}</span>)}
            </div>
            {selectedCompetitorProfile === ci && (
              <div style={{ marginTop: "12px", borderTop: "1px solid #222", paddingTop: "12px" }}>
                <p style={{ color: "#f59e0b", fontSize: "12px", marginBottom: "6px" }}>✅ Better than Raj: <span style={{ color: "#ccc" }}>{comp.betterThanRaj}</span></p>
                <p style={{ color: "#22c55e", fontSize: "12px", marginBottom: "10px" }}>💪 Raj's Advantage: <span style={{ color: "#ccc" }}>{comp.weakerThanRaj}</span></p>
                <p style={{ color: "#818cf8", fontSize: "12px", marginBottom: "6px", fontWeight: "bold" }}>Recent Guests:</p>
                {comp.recentGuests?.map((g, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 8px", background: "#0d0d1a", borderRadius: "6px", marginBottom: "4px" }}>
                    <span style={{ color: "#ccc", fontSize: "12px" }}>{g.name}</span>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <span style={{ color: "#a78bfa", fontSize: "11px" }}>{g.category}</span>
                      <span style={{ color: g.performance === "High" ? "#22c55e" : g.performance === "Medium" ? "#f59e0b" : "#ef4444", fontSize: "11px" }}>{g.performance}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )}
  {loadingCompetitorGaps && <div style={{ textAlign: "center", padding: "40px", color: "#7c3aed" }}><div style={{ fontSize: "40px", marginBottom: "16px" }}>⏳</div><p>Analyzing gaps across selected competitors...</p></div>}
  {competitorGaps && (
    <div>
      <h3 style={{ color: "#818cf8", marginBottom: "16px" }}>🎯 Gap Opportunities Ranked by Priority</h3>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "16px" }}>
        {competitorGaps.map((gap, i) => (
          <div key={i} style={{ background: "#111827", border: `1px solid ${gap.urgencyScore >= 8 ? "#ef4444" : gap.urgencyScore >= 6 ? "#f59e0b" : "#22c55e"}44`, borderRadius: "12px", padding: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <span style={{ background: "#1e1e3f", color: "#a78bfa", padding: "2px 8px", borderRadius: "4px", fontSize: "11px" }}>{gap.gapType}</span>
              <span style={{ color: gap.urgencyScore >= 8 ? "#ef4444" : gap.urgencyScore >= 6 ? "#f59e0b" : "#22c55e", fontWeight: "bold", fontSize: "14px" }}>{gap.urgencyScore}/10</span>
            </div>
            <h4 style={{ color: "#fff", marginBottom: "8px", fontSize: "14px" }}>{gap.gapTitle}</h4>
            <p style={{ color: "#888", fontSize: "12px", marginBottom: "8px" }}>{gap.whyItMatters}</p>
            <p style={{ color: "#666", fontSize: "11px", marginBottom: "8px" }}>Competitors winning: {gap.competitorsWinning?.join(", ")}</p>
            <div style={{ background: "#0d0d1a", borderRadius: "8px", padding: "10px", marginBottom: "10px" }}>
              <p style={{ color: "#a78bfa", fontSize: "12px", marginBottom: "4px" }}>🎯 Suggested Guest: <span style={{ color: "#fff", fontWeight: "bold" }}>{gap.suggestedGuest}</span></p>
              <p style={{ color: "#888", fontSize: "11px", marginBottom: "4px" }}>🎙️ {gap.episodeAngle}</p>
              <p style={{ color: "#888", fontSize: "11px", marginBottom: "4px" }}>💰 Sponsor: {gap.sponsorFit}</p>
              {gap.riskWarning && <p style={{ color: "#f59e0b", fontSize: "11px" }}>⚠️ {gap.riskWarning}</p>}
            </div>
            <button onClick={() => setPipelineGuests(prev => [...prev, { name: gap.suggestedGuest, status: "New", notes: gap.episodeAngle, addedAt: new Date().toISOString() }])} style={{ width: "100%", padding: "8px", borderRadius: "8px", background: "#1a2e3f", color: "#38bdf8", border: "1px solid #0369a1", cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}>+ Add to Pipeline</button>
          </div>
        ))}
      </div>
    </div>
  )}
</div>
)}

{/* HISTORY OVERLAY */}
{historyView && (
  <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.85)", zIndex: 2000, overflowY: "auto", padding: "24px" }}>
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h2 style={{ margin: "0 0 4px", color: "#f59e0b" }}>📜 Guest History Log <span style={{ fontSize: "12px", color: "#4ade80" }}>☁️ Cloud Synced</span></h2>
          <p style={{ margin: 0, fontSize: "12px", color: "#555" }}>All guests ever suggested by AI — last 30 sessions</p>
        </div>
        <button onClick={() => setHistoryView(false)} style={{ padding: "8px 20px", borderRadius: "8px", background: "#2a1a1a", color: "#f87171", border: "1px solid #7f1d1d", cursor: "pointer", fontSize: "14px", fontWeight: "bold" }}>✕ Close</button>
      </div>
      {guestHistory.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px", color: "#555", background: "#111827", borderRadius: "12px" }}>
          <div style={{ fontSize: "40px", marginBottom: "16px" }}>📭</div>
          <p>No history yet. Generate guests to start building history.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {guestHistory.map((entry, ei) => (
            <div key={ei} style={{ background: "#111827", borderRadius: "12px", border: "1px solid #1f2937", overflow: "hidden" }}>
              <div style={{ padding: "12px 16px", background: "#0d0d1a", borderBottom: "1px solid #1f2937", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "13px", color: "#f59e0b", fontWeight: "bold" }}>📅 {entry.date}</span>
                <span style={{ fontSize: "12px", color: "#555" }}>{entry.guests.length} guests suggested</span>
              </div>
              <div style={{ padding: "12px 16px", display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {entry.guests.map((g, gi) => (
                  <div key={gi} style={{ background: "#1f2937", borderRadius: "8px", padding: "6px 12px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "13px", color: "#fff", fontWeight: "bold" }}>{g.name}</span>
                    <span style={{ fontSize: "11px", background: "#1e1e3f", color: "#a78bfa", padding: "1px 6px", borderRadius: "10px" }}>{g.category}</span>
                    <span style={{ fontSize: "12px", fontWeight: "bold", color: g.priority === "High" ? "#00ff88" : g.priority === "Medium" ? "#ffaa00" : "#ff6666" }}>{g.total}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
)}
      {/* TITLES OVERLAY */}
      {showTitles && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.88)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
          <div style={{ background: "#111827", borderRadius: "16px", padding: "28px", maxWidth: "600px", width: "100%", border: "1px solid #6b21a8" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div>
                <h2 style={{ margin: "0 0 4px", color: "#c084fc" }}>🎬 Episode Title Suggestions</h2>
                <p style={{ margin: 0, fontSize: "12px", color: "#555" }}>Guest: {titleGuest?.name}</p>
              </div>
              <button onClick={() => setShowTitles(false)} style={{ padding: "6px 14px", borderRadius: "8px", background: "#2a1a1a", color: "#f87171", border: "1px solid #7f1d1d", cursor: "pointer", fontSize: "13px" }}>✕ Close</button>
            </div>
            {loadingTitles ? <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>⏳ Generating viral titles...</div> : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {titles.map((title, ti) => (
                  <div key={ti} style={{ background: "#1a0a2e", borderRadius: "10px", padding: "14px 16px", border: "1px solid #4c1d95", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontSize: "14px", color: "#e9d5ff", flex: 1, lineHeight: "1.5" }}>{title}</span>
                    <button onClick={() => navigator.clipboard.writeText(title)} style={{ padding: "5px 12px", borderRadius: "6px", background: "#2d1a3e", color: "#c084fc", border: "1px solid #6b21a8", cursor: "pointer", fontSize: "11px", whiteSpace: "nowrap" }}>Copy</button>
                  </div>
                ))}
                {titles.length > 0 && <button onClick={() => navigator.clipboard.writeText(titles.join("\n"))} style={{ marginTop: "8px", padding: "10px", borderRadius: "8px", background: "linear-gradient(135deg,#4c1d95,#2563eb)", color: "#fff", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: "bold" }}>📋 Copy All Titles</button>}
                <button onClick={() => generateTitles(titleGuest)} style={{ padding: "8px", borderRadius: "8px", background: "#1f2937", color: "#9ca3af", border: "1px solid #374151", cursor: "pointer", fontSize: "12px" }}>🔄 Regenerate</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* BRIEF OVERLAY */}
      {showBrief && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.88)", zIndex: 2000, overflowY: "auto", padding: "24px" }}>
          <div style={{ background: "#111827", borderRadius: "16px", padding: "28px", maxWidth: "750px", margin: "0 auto", border: "1px solid #92400e" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
              <div>
                <h2 style={{ margin: "0 0 4px", color: "#fbbf24" }}>📄 Pre-Interview Brief</h2>
                <p style={{ margin: 0, fontSize: "12px", color: "#555" }}>Guest: {intelGuest?.name} • For Raj's eyes only</p>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={() => { navigator.clipboard.writeText(brief); setCopiedBrief(true); setTimeout(() => setCopiedBrief(false), 2000) }} style={{ padding: "8px 16px", borderRadius: "8px", background: copiedBrief ? "#1a3a2a" : "#1e3a5f", color: copiedBrief ? "#4ade80" : "#60a5fa", border: "none", cursor: "pointer", fontSize: "12px" }}>{copiedBrief ? "✅ Copied!" : "📋 Copy Brief"}</button>
                <button onClick={() => setShowBrief(false)} style={{ padding: "8px 16px", borderRadius: "8px", background: "#2a1a1a", color: "#f87171", border: "1px solid #7f1d1d", cursor: "pointer", fontSize: "13px" }}>✕ Close</button>
              </div>
            </div>
            {loadingBrief ? <div style={{ textAlign: "center", padding: "60px", color: "#666" }}>⏳ Generating pre-interview brief...</div> : (
              <div>
                <div style={{ whiteSpace: "pre-wrap", lineHeight: "1.9", color: "#d1d5db", fontSize: "14px", background: "#0d1117", borderRadius: "10px", padding: "20px", border: "1px solid #1f2937", marginBottom: "16px" }}>{brief}</div>
                <button onClick={() => generateBrief(intelGuest)} style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "#1f2937", color: "#9ca3af", border: "1px solid #374151", cursor: "pointer", fontSize: "12px" }}>🔄 Regenerate Brief</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FLOATING COMPARE BAR */}
      {comparedGuests.length > 0 && view !== "compare" && (
        <div style={{ position: "fixed", bottom: "16px", left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg,#1a0533,#0d1f3c)", border: "1px solid #7c3aed", borderRadius: "14px", padding: "12px 20px", display: "flex", alignItems: "center", gap: "12px", zIndex: 1000, boxShadow: "0 8px 32px rgba(124,58,237,0.4)", flexWrap: "wrap", justifyContent: "center", maxWidth: "90vw" }}>
          <span style={{ fontSize: "12px", color: "#a78bfa", fontWeight: "bold" }}>⚖️ Comparing ({comparedGuests.length}/3):</span>
          {comparedGuests.map((g, i) => (
            <span key={i} style={{ fontSize: "12px", background: "#2e1e5f", color: "#c4b5fd", padding: "4px 10px", borderRadius: "20px", display: "flex", alignItems: "center", gap: "6px" }}>
              {g.name}
              <span onClick={() => toggleCompare(g)} style={{ cursor: "pointer", color: "#f87171", fontWeight: "bold" }}>×</span>
            </span>
          ))}
          {comparedGuests.length >= 2 && <button onClick={() => setView("compare")} style={{ padding: "7px 16px", borderRadius: "10px", background: "linear-gradient(135deg,#7c3aed,#2563eb)", color: "#fff", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: "bold" }}>Compare Now →</button>}
          <button onClick={() => setComparedGuests([])} style={{ padding: "7px 12px", borderRadius: "10px", background: "#2a1a1a", color: "#f87171", border: "1px solid #7f1d1d", cursor: "pointer", fontSize: "12px" }}>Clear</button>
        </div>
      )}

    </div>
  )

  function renderTrendCard(trend, ti) {
    return (
      <div key={ti} style={{ background: "#111827", borderRadius: "12px", border: `1px solid ${heatColor(trend.heat)}33`, overflow: "hidden" }}>
        <div style={{ padding: "16px", borderBottom: "1px solid #1f2937", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "16px", fontWeight: "bold", color: heatColor(trend.heat) }}>🔥 {trend.topic}</span>
              <span style={{ fontSize: "11px", background: "#1e1e3f", color: "#a78bfa", padding: "2px 8px", borderRadius: "20px" }}>{trend.category}</span>
              {trend.scope && <span style={{ fontSize: "10px", background: trend.scope === "India" ? "#7c2d12" : "#1e1b4b", color: trend.scope === "India" ? "#fb923c" : "#818cf8", padding: "2px 8px", borderRadius: "20px", fontWeight: "bold" }}>{trend.scope === "India" ? "🇮🇳" : "🌍"} {trend.scope}</span>}
            </div>
            <p style={{ margin: 0, fontSize: "13px", color: "#9ca3af", lineHeight: "1.5" }}>{trend.headline}</p>
          </div>
          <div style={{ textAlign: "center", minWidth: "44px" }}>
            <div style={{ fontSize: "20px", fontWeight: "bold", color: heatColor(trend.heat) }}>{trend.heat}</div>
            <div style={{ fontSize: "10px", color: "#555" }}>heat</div>
            <div style={{ width: "40px", height: "4px", background: "#1f2937", borderRadius: "2px", marginTop: "4px", overflow: "hidden" }}>
              <div style={{ width: `${trend.heat * 10}%`, height: "100%", background: heatColor(trend.heat), borderRadius: "2px" }} />
            </div>
          </div>
        </div>
        <div style={{ padding: "16px" }}>
          {!trendGuests[trend.topic] && loadingTrendGuest !== trend.topic && (
            <button onClick={() => findGuestForTrend(trend)} style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "linear-gradient(135deg,#1a2e1a,#14532d)", color: "#4ade80", border: "1px solid #166534", cursor: "pointer", fontSize: "13px", fontWeight: "bold" }}>🎯 Find Exclusive Guest for This Trend</button>
          )}
          {loadingTrendGuest === trend.topic && <div style={{ textAlign: "center", padding: "16px", color: "#666", fontSize: "13px" }}>⏳ Finding the perfect exclusive guest...</div>}
          {trendGuests[trend.topic] && (() => {
            const g = trendGuests[trend.topic]
            return (
              <div style={{ background: "#0d1117", borderRadius: "8px", padding: "14px", border: `1px solid ${priorityColor(g.priority)}33` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                  <div>
                    <div style={{ fontWeight: "bold", fontSize: "15px", color: "#fff", marginBottom: "4px" }}>{g.name}</div>
                    <span style={{ fontSize: "11px", background: "#1e1e3f", color: "#a78bfa", padding: "2px 8px", borderRadius: "20px" }}>{g.category}</span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "22px", fontWeight: "bold", color: priorityColor(g.priority) }}>{g.total}</div>
                    <div style={{ fontSize: "10px", color: priorityColor(g.priority) }}>{g.priority}</div>
                  </div>
                </div>
                <p style={{ fontSize: "12px", color: "#9ca3af", margin: "0 0 6px", lineHeight: "1.5" }}><span style={{ color: "#f59e0b" }}>Why:</span> {g.whyNow}</p>
                <p style={{ fontSize: "12px", color: "#9ca3af", margin: "0 0 12px", lineHeight: "1.5" }}><span style={{ color: "#60a5fa" }}>Angle:</span> {g.topicAngle}</p>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  <button onClick={() => addToPipeline(g, "trending")} style={{ flex: 1, padding: "7px", borderRadius: "7px", background: "#1a2e3f", color: "#38bdf8", border: "1px solid #0369a1", cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}>+ Pipeline</button>
                  <button onClick={() => generateResearch(g)} style={{ flex: 1, padding: "7px", borderRadius: "7px", background: "#1e3a5f", color: "#60a5fa", border: "1px solid #1e40af", cursor: "pointer", fontSize: "12px" }}>Research</button>
                  <button onClick={() => generateOutreach(g)} style={{ flex: 1, padding: "7px", borderRadius: "7px", background: "#1a2e1a", color: "#4ade80", border: "1px solid #166534", cursor: "pointer", fontSize: "12px" }}>Outreach</button>
                  <button onClick={() => toggleCompare(g)} style={{ flex: 1, padding: "7px", borderRadius: "7px", background: comparedGuests.find(c => c.name === g.name) ? "#1a3a2a" : "#1a1a2e", color: comparedGuests.find(c => c.name === g.name) ? "#4ade80" : "#a78bfa", border: "1px solid #4c1d95", cursor: "pointer", fontSize: "12px" }}>Compare</button>
                </div>
              </div>
            )
          })()}
        </div>
      </div>
    )
  }
}

export default App