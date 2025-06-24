<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <header class="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50">
      <div class="max-w-7xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <TrendingUp class="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900">Athenaly</h1>
              <p class="text-sm text-gray-500">Route Visualizer</p>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <div class="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              {{ activities.length }} activities
            </div>
            <div class="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              Demo
            </div>
            <div v-if="isAnimating" class="flex items-center space-x-2 text-orange-500">
              <div class="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
              <span class="text-sm font-medium">Animating</span>
            </div>
            <button @click="logout" class="logout-btn ml-2 px-5 py-2 bg-white text-gray-800 text-base rounded-full font-semibold border border-gray-300 shadow-sm hover:bg-gray-100 hover:text-black transition-all flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" ><path d="M3 13h1v7c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-7h1c.4 0 .77-.24.92-.62.15-.37.07-.8-.22-1.09l-8.99-9a.996.996 0 0 0-1.41 0l-9.01 9c-.29.29-.37.72-.22 1.09s.52.62.92.62Zm7 7v-5h4v5zm2-15.59 6 6V20h-2v-5c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v5H6v-9.59z"></path></svg>
              <span class="tracking-wide">Home</span>
            </button>
          </div>
        </div>
      </div>
    </header>
    <div class="max-w-7xl mx-auto px-4 py-6">
      <div class="grid lg:grid-cols-4 gap-6">
        <div class="lg:col-span-1">
          <div class="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
            <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Activity class="w-5 h-5 mr-2 text-orange-500" />
              Activities
            </h3>
            <div class="mb-6 space-y-4">
              <div class="relative">
                <select 
                  v-model="selectedSport" 
                  class="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:bg-white transition-all appearance-none cursor-pointer"
                >
                  <option value="">All Sports</option>
                  <option value="Run">🏃‍♂️ Running</option>
                  <option value="Ride">🚴‍♂️ Cycling</option>
                </select>
                <ChevronDown class="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              <div class="flex items-center justify-between text-sm text-gray-600">
                <span class="font-medium">{{ filteredActivities.length }} activities</span>
                <span v-if="selectedActivity" class="text-orange-500 font-medium truncate ml-2">{{ selectedActivity.name }}</span>
              </div>
            </div>
            <div v-if="selectedActivity && routeCoordinates.length > 0" class="mb-6 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-100">
              <h4 class="text-sm font-bold text-gray-900 mb-4 flex items-center">
                <Play class="w-4 h-4 mr-2 text-orange-500" />
                Route Animation
              </h4>
              <div class="space-y-4">
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <label class="text-xs font-semibold text-gray-700">Animation Speed</label>
                    <span class="text-xs font-bold text-orange-600">{{ animationSpeed }}x</span>
                  </div>
                  <div class="relative">
                    <input
                      v-model="animationSpeed"
                      type="range"
                      min="0.25"
                      max="1"
                      step="0.05"
                      class="speed-slider w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div class="flex justify-between text-xs text-gray-400 mt-1">
                      <span>0.25x</span>
                      <span>1x</span>
                    </div>
                  </div>
                </div>
                <div v-if="isAnimating || animationProgress > 0">
                  <div class="flex items-center justify-between mb-2">
                    <label class="text-xs font-semibold text-gray-700">Progress</label>
                    <span class="text-xs font-bold text-orange-600">{{ Math.round(animationProgress) }}%</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div 
                      class="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-300 ease-out progress-bar" 
                      :style="{ width: `${animationProgress}%` }"
                    ></div>
                  </div>
                </div>
                <div class="grid grid-cols-3 gap-2">
                  <button
                    @click="startAnimation"
                    :disabled="isAnimating"
                    class="btn-gradient group relative px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-xs font-semibold flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
                  >
                    <Play class="w-3 h-3 mr-1" />
                    Play
                    <div class="absolute inset-0 bg-white/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </button>
                  <button
                    @click="pauseAnimation"
                    :disabled="!isAnimating"
                    class="btn-gradient group relative px-3 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-xs font-semibold flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
                  >
                    <Pause class="w-3 h-3 mr-1" />
                    Pause
                    <div class="absolute inset-0 bg-white/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </button>
                  <button
                    @click="resetAnimation"
                    class="btn-gradient group relative px-3 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-200 text-xs font-semibold flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <RotateCcw class="w-3 h-3 mr-1" />
                    Reset
                    <div class="absolute inset-0 bg-white/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </button>
                </div>
              </div>
            </div>
            <div class="space-y-2 overflow-y-auto max-h-[500px] pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              <div
                v-for="activity in filteredActivities"
                :key="activity.id"
                @click="selectActivity(activity)"
                :class="[
                  'activity-card group p-4 rounded-xl border cursor-pointer transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02]',
                  selectedActivity?.id === activity.id
                    ? 'border-orange-500 bg-gradient-to-r from-orange-50 to-red-50 shadow-lg scale-[1.02]'
                    : 'border-gray-200 hover:border-gray-300 bg-white/50 hover:bg-white/80'
                ]"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center space-x-2 mb-2">
                      <div :class="[
                        'w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-md',
                        activity.sport_type === 'Run' 
                          ? 'bg-gradient-to-br from-red-500 to-pink-500' 
                          : 'bg-gradient-to-br from-blue-500 to-indigo-500'
                      ]">
                        {{ activity.sport_type === 'Run' ? '🏃' : '🚴' }}
                      </div>
                      <div class="flex-1 min-w-0">
                        <span class="text-sm font-bold text-gray-900 truncate block">
                          {{ activity.name }}
                        </span>
                        <div class="text-xs text-gray-500 mt-1">
                          {{ formatDate(activity.start_date) }}
                        </div>
                      </div>
                    </div>
                    <div class="grid grid-cols-2 gap-2 text-xs">
                      <div class="bg-gray-100 rounded-lg px-2 py-1">
                        <span class="text-gray-600">Distance</span>
                        <div class="font-bold text-gray-900">{{ formatDistance(activity.distance) }}</div>
                      </div>
                      <div class="bg-gray-100 rounded-lg px-2 py-1">
                        <span class="text-gray-600">Time</span>
                        <div class="font-bold text-gray-900">{{ formatDuration(activity.moving_time) }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="lg:col-span-3">
          <div class="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            <div class="p-6 border-b border-gray-200/50">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-bold text-gray-900 flex items-center">
                  <MapPin class="w-5 h-5 mr-2 text-orange-500" />
                  Route Map
                </h3>
                <div class="flex items-center space-x-4">
                  <div class="flex items-center space-x-3">
                    <span class="text-sm font-medium text-gray-700">Map View</span>
                    <div class="relative">
                      <button
                        @click="toggleMapView"
                        :class="[
                          'map-toggle relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2',
                          isSatelliteView ? 'bg-blue-500' : 'bg-green-500'
                        ]"
                      >
                        <span
                          :class="[
                            'map-toggle-thumb inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-200',
                            isSatelliteView ? 'translate-x-9' : 'translate-x-1'
                          ]"
                        >
                          <component 
                            :is="isSatelliteView ? 'Satellite' : 'Map'" 
                            class="w-4 h-4 text-gray-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                          />
                        </span>
                      </button>
                    </div>
                    <span class="text-xs text-gray-500">
                      {{ isSatelliteView ? 'Satellite' : 'Street' }}
                    </span>
                  </div>
                  <div class="flex items-center space-x-2 ml-4">
                    <label class="flex items-center cursor-pointer select-none">
                      <input type="checkbox" v-model="followRoute" class="form-checkbox accent-orange-500 mr-2" />
                      <span class="text-xs text-gray-700">Follow Route</span>
                    </label>
                  </div>
                  <div v-if="selectedActivity" class="flex items-center space-x-4 text-sm">
                    <div class="bg-gray-100 rounded-full px-3 py-1">
                      <span class="text-gray-600">{{ formatDistance(selectedActivity.distance) }}</span>
                    </div>
                    <div class="bg-gray-100 rounded-full px-3 py-1">
                      <span class="text-gray-600">{{ formatDuration(selectedActivity.moving_time) }}</span>
                    </div>
                    <div :class="[
                      'rounded-full px-3 py-1 text-white font-medium',
                      selectedActivity.sport_type === 'Run' 
                        ? 'bg-gradient-to-r from-red-500 to-pink-500' 
                        : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                    ]">
                      {{ selectedActivity.sport_type }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="relative map-container">
              <div 
                ref="mapContainer" 
                class="h-96 lg:h-[500px] w-full bg-gray-100"
                style="min-height: 500px;"
              ></div>
              <div 
                v-if="mapLoading" 
                class="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm"
              >
                <div class="text-center text-gray-500">
                  <div class="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <div class="text-lg font-semibold">Loading map...</div>
                  <div class="text-sm">Preparing your route visualization</div>
                </div>
              </div>
              <div 
                v-if="!selectedActivity && !mapLoading" 
                class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100"
              >
                <div class="text-center text-gray-500">
                  <div class="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                    <MapPin class="w-10 h-10 text-white" />
                  </div>
                  <div class="text-xl font-bold text-gray-900 mb-2">Select an activity</div>
                  <div class="text-sm text-gray-600">Choose an activity from the list to view its route</div>
                </div>
              </div>
              <div v-if="debugInfo" class="absolute top-4 right-4 bg-black/80 backdrop-blur-sm text-white text-xs p-3 rounded-lg shadow-lg">
                {{ debugInfo }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted, nextTick, onUnmounted } from 'vue'
import { TrendingUp, User, Bike, MapPin, Play, Pause, RotateCcw, Activity, ChevronDown, Satellite, Map } from 'lucide-vue-next'
const mapContainer = ref(null)
const selectedActivity = ref(null)
const selectedSport = ref('')
const map = ref(null)
const currentPolyline = ref(null)
const animatedPolyline = ref(null)
const movingMarker = ref(null)
const startMarker = ref(null)
const endMarker = ref(null)
const mapLoading = ref(true)
const debugInfo = ref('')
const leafletLoaded = ref(false)
const isSatelliteView = ref(false)
const streetLayer = ref(null)
const satelliteLayer = ref(null)
const followRoute = ref(false)
const isAnimating = ref(false)
const animationSpeed = ref(0.5)
const animationProgress = ref(0)
const routeCoordinates = ref([])
const animationFrame = ref(null)
const animationStartTime = ref(0)
const activities = ref([
  {
    "name": "Evening Ride",
    "distance": 23011.2,
    "moving_time": 3290,
    "elapsed_time": 4237,
    "total_elevation_gain": 56.3,
    "type": "Ride",
    "sport_type": "Ride",
    "workout_type": null,
    "id": 14769312358,
    "start_date": "2025-06-11T10:30:11Z",
    "start_date_local": "2025-06-11T18:30:11Z",
    "timezone": "(GMT+08:00) Asia/Kuala_Lumpur",
    "utc_offset": 28800,
    "map" : {
    "id" : "a1410355832",
    "summary_polyline" : "{zkrIm`inANPD?BDXGPKLATHNRBRFtAR~AFjAHl@D|ALtATj@HHJBL?`@EZ?NQ\\Y^MZURGJKR]RMXYh@QdAWf@[~@aAFGb@?j@YJKBU@m@FKZ[NSPKTCRJD?`@Wf@Wb@g@HCp@Qh@]z@SRMRE^EHJZnDHbBGPHb@NfBTxBN|DVbCBdA^lBFl@Lz@HbBDl@Lr@Bb@ApCAp@Ez@g@bEMl@g@`B_AvAq@l@    QF]Rs@Nq@CmAVKCK?_@Nw@h@UJIHOZa@xA]~@UfASn@U`@_@~@[d@Sn@s@rAs@dAGN?NVhAB\\Ox@@b@S|A?Tl@jBZpAt@vBJhATfGJn@b@fARp@H^Hx@ARGNSTIFWHe@AGBOTAP@^\\zBMpACjEWlEIrCKl@i@nAk@}@}@yBOWSg@kAgBUk@Mu@[mC?QLIEUAuAS_E?uCKyCA{BH{DDgF`AaEr@uAb@oA~@{AE}AKw@    g@qAU[_@w@[gAYm@]qAEa@FOXg@JGJ@j@o@bAy@NW?Qe@oCCc@SaBEOIIEQGaAe@kC_@{De@cE?KD[H[P]NcAJ_@DGd@Gh@UHI@Ua@}Bg@yBa@uDSo@i@UIICQUkCi@sCKe@]aAa@oBG{@G[CMOIKMQe@IIM@KB]Tg@Nw@^QL]NMPMn@@\\Lb@P~@XT"
  }
},
{
    "name": "Evening Ride",
    "distance": 10014.2,
    "moving_time": 4379,
    "elapsed_time": 4379,
    "total_elevation_gain": 61,
    "type": "Run",
    "sport_type": "Run",
    "workout_type": null,
    "start_date": "2025-06-06T12:18:14Z",
    "start_date_local": "2025-06-06T20:18:14Z",
    "timezone": "(GMT+08:00) Asia/Kuala_Lumpur",
    "map": {
      "id": "a14713761804",
      "summary_polyline": "u}krIq_inA_@y@My@Yu@OqAUsA]mAQc@CS@o@FSHSp@e@n@Wl@]ZCFEBK?OC_@Qw@?m@CSK[]]EMBeAA_@m@qEAg@UoCAaAMs@IkBMoACq@SwAGOYa@IYIyA_@kEMkC]{DEaAScC@yEHkGA_ALsCBiA@mCD{CCuAZcANOH@HDZl@Z`@RFh@\\TDT@ZVJBPMVGLM\\Mz@c@NCPMXERO|@a@^Ut@s@p@KJAJ    Bd@EHEXi@f@a@\\g@b@[HUD_B@uADg@DQLCLD~@l@`@J^TF?JANQ\\UbAyABEZIFG`@o@RAJEl@_@ZENDDIA[Ki@BURQZaARODKVs@LSdAiAz@G`BU^A^GT@PRp@zARXRn@`BlDHt@ZlAFh@^`BX|@HHHEf@i@FAHHp@bBd@v@DRAVMl@i@v@SROXm@tBILOTOLs@NON_@t@KX]h@Un@k@\\c@h@Ud@]ZGNKp@Sj@KJo@    b@W`@UPOX]XWd@UF]b@WPOAIBSf@QVi@j@_@V[b@Uj@YtAEFCCELARBn@`@lBjAzD^vB^hB?LENURkAv@[Ze@Xg@Py@p@QHONMA[HGAWE_@Em@Hg@AMCG@QHq@Cm@M[Jy@?UJIA{@Ae@KI@GFKNIX[QGAcAT[JK?OVMFK@IAIUKAYJI?QKUCGFIZCXDtAHl@@p@LjBCZS^ERAn@Fj@Br@Hn@HzAHh@RfD?j@TnCTlA    NjANb@\\z@TtARr@P`AFnAGfBG`@CFE?",
      "resource_state": 2
    },
}
  ])
const urlParams = new URLSearchParams(window.location.search);
const filteredActivities = computed(() => {
  if (!selectedSport.value) return activities.value
  return activities.value.filter(activity => activity.sport_type === selectedSport.value)
})
const polylineDecode = (str, precision = 5) => {
  try {
    if (!str || typeof str !== 'string') {
      console.warn('Invalid polyline string:', str)
      return []
    }
    let index = 0
    let lat = 0
    let lng = 0
    const coordinates = []
    const factor = Math.pow(10, precision)
    while (index < str.length) {
      let shift = 1
      let result = 0
      let byte = null
      do {
        if (index >= str.length) break
        byte = str.charCodeAt(index++) - 63
        result += (byte & 0x1f) * shift
        shift *= 32
      } while (byte >= 0x20)
      const latitude_change = result & 1 ? (-result - 1) / 2 : result / 2
      shift = 1
      result = 0
      do {
        if (index >= str.length) break
        byte = str.charCodeAt(index++) - 63
        result += (byte & 0x1f) * shift
        shift *= 32
      } while (byte >= 0x20)
      const longitude_change = result & 1 ? (-result - 1) / 2 : result / 2
      lat += latitude_change
      lng += longitude_change
      const decodedLat = lat / factor
      const decodedLng = lng / factor
      if (Math.abs(decodedLat) <= 90 && Math.abs(decodedLng) <= 180) {
        coordinates.push([decodedLat, decodedLng])
      }
    }
    return coordinates
  } catch (error) {
    console.error('Error decoding polyline:', error, 'Input:', str)
    return []
  }
}
const formatDistance = (distance) => {
  return `${(distance / 1000).toFixed(1)} km`
}
const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}
const loadLeaflet = () => {
  return new Promise((resolve, reject) => {
    if (window.L) {
      leafletLoaded.value = true
      resolve(window.L)
      return
    }
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    script.onload = () => {
      leafletLoaded.value = true
      resolve(window.L)
    }
    script.onerror = reject
    document.head.appendChild(script)
  })
}
const toggleMapView = () => {
  if (!map.value || !streetLayer.value || !satelliteLayer.value) return
  isSatelliteView.value = !isSatelliteView.value
  if (isSatelliteView.value) {
    map.value.removeLayer(streetLayer.value)
    map.value.addLayer(satelliteLayer.value)
  } else {
    map.value.removeLayer(satelliteLayer.value)
    map.value.addLayer(streetLayer.value)
  }
}
const startAnimation = () => {
  if (!routeCoordinates.value.length || isAnimating.value) return
  isAnimating.value = true
  animationStartTime.value = performance.now()
  animationProgress.value = 0
  clearAnimatedElements()
  animateRoute()
}
const pauseAnimation = () => {
  isAnimating.value = false
  if (animationFrame.value) {
    cancelAnimationFrame(animationFrame.value)
  }
}
const resetAnimation = () => {
  pauseAnimation()
  animationProgress.value = 0
  clearAnimatedElements()
  if (currentPolyline.value && map.value) {
    currentPolyline.value.setStyle({ opacity: 0.8 })
  }
}
const clearAnimatedElements = () => {
  const L = window.L
  if (!L || !map.value) return
  if (animatedPolyline.value) {
    map.value.removeLayer(animatedPolyline.value)
    animatedPolyline.value = null
  }
  if (movingMarker.value) {
    map.value.removeLayer(movingMarker.value)
    movingMarker.value = null
  }
}
const animateRoute = () => {
  if (!isAnimating.value || !routeCoordinates.value.length) return
  const currentTime = performance.now()
  const elapsed = currentTime - animationStartTime.value
  const duration = (routeCoordinates.value.length / animationSpeed.value) * 50
  const progress = Math.min(elapsed / duration, 1)
  animationProgress.value = progress * 100
  const pointsToShow = Math.floor(progress * routeCoordinates.value.length)
  if (pointsToShow > 1) {
    updateAnimatedPolyline(pointsToShow)
  }
  if (progress < 1) {
    animationFrame.value = requestAnimationFrame(animateRoute)
  } else {
    isAnimating.value = false
    animationProgress.value = 100
    if (currentPolyline.value) {
      currentPolyline.value.setStyle({ opacity: 0.8 })
    }
    clearAnimatedElements()
  }
}
const updateAnimatedPolyline = (pointsToShow) => {
  const L = window.L
  if (!L || !map.value) return
  const coordinatesToShow = routeCoordinates.value.slice(0, pointsToShow)
  const color = selectedActivity.value.sport_type === 'Run' ? '#ef4444' : '#3b82f6'
  if (animatedPolyline.value) {
    map.value.removeLayer(animatedPolyline.value)
  }
  animatedPolyline.value = L.polyline(coordinatesToShow, {
    color: color,
    weight: 4,
    opacity: 1,
    smoothFactor: 1
  }).addTo(map.value)
  if (movingMarker.value) {
    map.value.removeLayer(movingMarker.value)
  }
  if (coordinatesToShow.length > 0) {
    const currentPosition = coordinatesToShow[coordinatesToShow.length - 1]
    movingMarker.value = L.circleMarker(currentPosition, {
      radius: 8,
      fillColor: '#f97316',
      color: '#ffffff',
      weight: 3,
      opacity: 1,
      fillOpacity: 1
    }).addTo(map.value)
    if (followRoute.value) {
      map.value.setView(currentPosition, 17, { animate: true })
    }
  }
  if (currentPolyline.value) {
    currentPolyline.value.setStyle({ opacity: 0.2 })
  }
}
const initializeMap = async () => {
  try {
    debugInfo.value = 'Loading Leaflet...'
    const L = await loadLeaflet()
    if (!mapContainer.value) {
      debugInfo.value = 'Map container not found'
      return
    }
    debugInfo.value = 'Initializing map...'
    map.value = L.map(mapContainer.value, {
      center: [5.306, 100.262],
      zoom: 13,
      zoomControl: true
    })
    streetLayer.value = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    })
    satelliteLayer.value = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: '© Esri',
      maxZoom: 19
    })
    streetLayer.value.addTo(map.value)
    debugInfo.value = 'Map initialized'
    mapLoading.value = false
    const firstActivityWithPolyline = activities.value.find(a => a.map?.summary_polyline)
    if (firstActivityWithPolyline) {
      await selectActivity(firstActivityWithPolyline)
    }
    setTimeout(() => {
      debugInfo.value = ''
    }, 3000)
  } catch (error) {
    console.error('Error initializing map:', error)
    debugInfo.value = `Error: ${error.message}`
    mapLoading.value = false
  }
}
const selectActivity = async (activity) => {
  try {
    resetAnimation()
    selectedActivity.value = activity
    if (!map.value || !activity.map?.summary_polyline) {
      debugInfo.value = 'No map or polyline data'
      return
    }
    debugInfo.value = 'Decoding polyline...'
    const L = window.L
    if (currentPolyline.value) {
      map.value.removeLayer(currentPolyline.value)
    }
    if (startMarker.value) {
      map.value.removeLayer(startMarker.value)
    }
    if (endMarker.value) {
      map.value.removeLayer(endMarker.value)
    }
    const coordinates = polylineDecode(activity.map.summary_polyline)
    routeCoordinates.value = coordinates
    if (coordinates.length === 0) {
      debugInfo.value = 'No valid coordinates decoded'
      return
    }
    debugInfo.value = `Decoded ${coordinates.length} points`
    const validCoords = coordinates.filter(([lat, lng]) => 
      lat >= 1 && lat <= 7 && lng >= 99 && lng <= 105
    )
    if (validCoords.length < coordinates.length * 0.8) {
      debugInfo.value = 'Warning: Some coordinates may be invalid'
    }
    const color = activity.sport_type === 'Run' ? '#ef4444' : '#3b82f6'
    currentPolyline.value = L.polyline(coordinates, {
      color: color,
      weight: 4,
      opacity: 0.8,
      smoothFactor: 1
    }).addTo(map.value)
    if (coordinates.length > 0) {
      startMarker.value = L.circleMarker(coordinates[0], {
        radius: 8,
        fillColor: '#10b981',
        color: '#ffffff',
        weight: 3,
        opacity: 1,
        fillOpacity: 1
      }).addTo(map.value).bindPopup('🏁 Start')
      endMarker.value = L.circleMarker(coordinates[coordinates.length - 1], {
        radius: 8,
        fillColor: '#ef4444',
        color: '#ffffff',
        weight: 3,
        opacity: 1,
        fillOpacity: 1
      }).addTo(map.value).bindPopup('🏆 Finish')
    }
    try {
      const bounds = currentPolyline.value.getBounds()
      map.value.fitBounds(bounds, { padding: [30, 30] })
    } catch (boundsError) {
      if (coordinates.length > 0) {
        map.value.setView(coordinates[0], 14)
      }
    }
    debugInfo.value = 'Route loaded successfully'
    setTimeout(() => {
      debugInfo.value = ''
    }, 2000)
  } catch (error) {
    console.error('Error selecting activity:', error)
    debugInfo.value = `Error: ${error.message}`
  }
}
onMounted(async () => {
  await nextTick()
  await initializeMap()
})
onUnmounted(() => {
  if (animationFrame.value) {
    cancelAnimationFrame(animationFrame.value)
  }
})
function logout() {
  localStorage.removeItem("accessToken");
  window.location.href = "/"
}
</script>
<style>
.leaflet-container {
  height: 100% !important;
  width: 100% !important;
  z-index: 1;
}
.leaflet-popup-content-wrapper {
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}
.leaflet-popup-content {
  margin: 12px 16px;
  font-size: 14px;
  font-weight: 600;
}
.speed-slider {
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  cursor: pointer;
}
.speed-slider::-webkit-slider-track {
  background: linear-gradient(to right, #f97316, #ef4444);
  height: 8px;
  border-radius: 4px;
}
.speed-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  background: linear-gradient(135deg, #ffffff, #f3f4f6);
  height: 24px;
  width: 24px;
  border-radius: 50%;
  border: 3px solid #f97316;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}
.speed-slider::-webkit-slider-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}
.speed-slider::-moz-range-track {
  background: linear-gradient(to right, #f97316, #ef4444);
  height: 8px;
  border-radius: 4px;
  border: none;
}
.speed-slider::-moz-range-thumb {
  background: linear-gradient(135deg, #ffffff, #f3f4f6);
  height: 24px;
  width: 24px;
  border-radius: 50%;
  border: 3px solid #f97316;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}
.speed-slider::-moz-range-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}
.scrollbar-thin {
  scrollbar-width: thin;
}
.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}
.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}
.backdrop-blur-md {
  backdrop-filter: blur(8px);
}
.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.group {
  animation: slideIn 0.3s ease-out;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.animate-spin {
  animation: spin 1s linear infinite;
}
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
.transform {
  transform: translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.hover\:scale-105:hover {
  --tw-scale-x: 1.05;
  --tw-scale-y: 1.05;
}
.hover\:scale-\[1\.02\]:hover {
  --tw-scale-x: 1.02;
  --tw-scale-y: 1.02;
}
.scale-\[1\.02\] {
  --tw-scale-x: 1.02;
  --tw-scale-y: 1.02;
}
.shadow-xl {
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
}
.hover\:shadow-xl:hover {
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
}
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
.duration-200 {
  transition-duration: 200ms;
}
.duration-300 {
  transition-duration: 300ms;
}
.ease-out {
  transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
}
.rounded-xl {
  border-radius: 0.75rem;
}
.rounded-2xl {
  border-radius: 1rem;
}
.bg-white\/70, .bg-white\/80, .bg-white {
  border: none !important;
  box-shadow: 0 4px 24px 0 rgba(0,0,0,0.04);
}
.border, .border-b, .border-t, .border-l, .border-r, .border-white\/20, .border-gray-200, .border-gray-200\/50, .border-orange-100 {
  border: none !important;
}
.rounded-2xl, .rounded-xl, .rounded-lg, .rounded-full {
  border-radius: 1rem !important;
}
.activity-card {
  border: none !important;
  background: #fff8f1 !important;
  box-shadow: 0 2px 8px 0 rgba(252, 76, 2, 0.04);
}
.activity-card:hover {
  background: #fff3e6 !important;
  box-shadow: 0 4px 16px 0 rgba(252, 76, 2, 0.08);
}
.btn-gradient {
  border: none !important;
}
.map-container {
  border: none !important;
  box-shadow: 0 2px 16px 0 rgba(252, 76, 2, 0.06);
}
.mb-6.p-4.bg-gradient-to-r {
  border: none !important;
}
select.bg-gray-50 {
  border: none !important;
}
.bg-gray-100.rounded-full, .bg-gray-100.rounded-lg {
  border: none !important;
}
.bg-black\/80 {
  border: none !important;
}
.activity-card {
  position: relative;
  overflow: hidden;
}
.activity-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}
.activity-card:hover::before {
  left: 100%;
}
.btn-gradient {
  position: relative;
  overflow: hidden;
}
.btn-gradient::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}
.btn-gradient:hover::before {
  left: 100%;
}
.progress-bar {
  transition: width 0.3s ease-out;
}
.map-container {
  position: relative;
  border-radius: 1rem;
  overflow: hidden;
}
.map-container::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 1rem;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.1);
  pointer-events: none;
}
@media (max-width: 1024px) {
  .max-w-7xl {
    max-width: 100vw !important;
    padding-left: 0.5rem !important;
    padding-right: 0.5rem !important;
  }
  .grid.lg\:grid-cols-4 {
    grid-template-columns: 1fr !important;
    gap: 1.5rem !important;
  }
  .lg\:col-span-1, .lg\:col-span-3 {
    grid-column: span 1 / span 1 !important;
  }
  .h-96, .lg\:h-\[500px\] {
    height: 320px !important;
  }
}
@media (max-width: 768px) {
  .max-w-7xl {
    max-width: 100vw !important;
    padding-left: 0.25rem !important;
    padding-right: 0.25rem !important;
  }
  .p-6, .px-4, .py-6 {
    padding: 1rem !important;
  }
  .rounded-2xl, .rounded-xl {
    border-radius: 0.75rem !important;
  }
  .h-96, .lg\:h-\[500px\] {
    height: 220px !important;
  }
  .activity-card {
    padding: 0.75rem !important;
  }
  .text-lg, .text-xl, .text-3xl, .text-4xl {
    font-size: 1.1rem !important;
  }
  .flex.items-center.space-x-4 {
    flex-direction: column !important;
    align-items: flex-start !important;
    gap: 0.5rem !important;
  }
}
@media (max-width: 480px) {
  .max-w-7xl {
    max-width: 100vw !important;
    padding-left: 0.1rem !important;
    padding-right: 0.1rem !important;
  }
  .p-6, .px-4, .py-6 {
    padding: 0.5rem !important;
  }
  .rounded-2xl, .rounded-xl {
    border-radius: 0.5rem !important;
  }
  .h-96, .lg\:h-\[500px\] {
    height: 140px !important;
  }
  .activity-card {
    padding: 0.5rem !important;
  }
  .text-lg, .text-xl, .text-3xl, .text-4xl {
    font-size: 1rem !important;
  }
  .flex.items-center.space-x-4 {
    flex-direction: column !important;
    align-items: flex-start !important;
    gap: 0.25rem !important;
  }
  .map-container {
    border-radius: 0.5rem !important;
  }
}
.logout-btn {
  background: #fff !important;
  color: #222 !important;
  border-radius: 9999px !important;
  font-weight: 600;
  font-size: 1rem;
  letter-spacing: 0.01em;
  border: 1px solid #e5e7eb !important;
  box-shadow: 0 1px 4px 0 rgba(0,0,0,0.04);
  outline: none;
  transition: background 0.15s, color 0.15s, box-shadow 0.15s, transform 0.1s;
}
.logout-btn:hover, .logout-btn:focus {
  background: #f3f4f6 !important;
  color: #111 !important;
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.08);
  transform: translateY(-1px) scale(1.03);
}
.logout-btn:active {
  transform: scale(0.98);
}
</style>
