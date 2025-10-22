// Main JavaScript for Magerly Website

// App configuration
const CONFIG = {
  appStoreUrl: 'https://apps.apple.com/app/magerly/id6738602349',
  playStoreUrl: 'https://play.google.com/store/apps/details?id=com.xxdsv.GrowingTogether',
  apiBaseUrl: window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api' 
    : 'https://api.magerly.com',
};

// Utility functions
const utils = {
  // Detect user's device and show appropriate app store button
  detectPlatform() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    
    // iOS detection
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      return 'ios';
    }
    
    // Android detection
    if (/android/i.test(userAgent)) {
      return 'android';
    }
    
    return 'desktop';
  },

  // Calculate baby age from birth date
  calculateBabyAge(birthDate) {
    const now = new Date();
    const birth = new Date(birthDate);
    const diffTime = Math.abs(now - birth);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    const days = diffDays % 30;
    
    return { years, months, days };
  },

  // Format baby age for display
  formatBabyAge(age) {
    const parts = [];
    if (age.years > 0) parts.push(`${age.years} year${age.years !== 1 ? 's' : ''}`);
    if (age.months > 0) parts.push(`${age.months} month${age.months !== 1 ? 's' : ''}`);
    if (age.days > 0) parts.push(`${age.days} day${age.days !== 1 ? 's' : ''}`);
    
    return parts.join(', ') || '0 days';
  },

  // Enhanced Google Analytics 4 event tracking
  trackEvent(eventName, properties = {}) {
    // Log to console for debugging (remove in production if needed)
    console.log('📊 GA4 Event:', eventName, properties);
    
    // Send to Google Analytics 4
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, properties);
    } else {
      console.warn('⚠️ Google Analytics (gtag) not loaded. Event not tracked:', eventName);
    }
  },
  
  // Enhanced download button tracking with more details
  trackDownload(platform, location, userAgent = null) {
    const detectedDevice = this.detectPlatform();
    
    this.trackEvent('download_app', {
      // Primary metrics
      platform: platform,                    // 'ios' or 'android'
      button_location: location,             // 'hero', 'calculator', etc.
      
      // User context
      detected_device: detectedDevice,       // What device user is on
      user_agent: userAgent || navigator.userAgent.substring(0, 100),
      
      // Session info
      page_url: window.location.href,
      page_title: document.title,
      timestamp: new Date().toISOString(),
      
      // For ecommerce tracking (app is free)
      value: 0,
      currency: 'USD',
      
      // Custom dimensions
      is_mobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent),
      screen_width: window.innerWidth,
      screen_height: window.innerHeight
    });
    
    // Also track as a conversion event for easier GA4 reporting
    this.trackEvent('download_button_click', {
      platform: platform,
      location: location
    });
  },

  // Smooth scroll to element
  scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }
};

// App initialization
document.addEventListener('DOMContentLoaded', function() {
  console.log('Magerly website loaded');
  
  // Initialize platform-specific download buttons
  initDownloadButtons();
  
  // Initialize age calculator if present
  initAgeCalculator();
  
  // Initialize smooth scrolling for navigation
  initSmoothScrolling();
  
  // Initialize footer functionality
  initFooter();
  
  // Add visual enhancements
  addAppPreviewImages();
  addInteractiveAnimations();
  
  // Initialize carousel
  initCarousel();
  
  // Track page view
  utils.trackEvent('page_view', {
    page_title: document.title,
    page_location: window.location.href
  });
});

// Add app preview images
function addAppPreviewImages() {
  const mockupContainer = document.querySelector('[role="img"][aria-label*="mockup"]');
  if (mockupContainer) {
    
    // Replace placeholder with more detailed preview
    mockupContainer.innerHTML = `
      <div class="space-y-6">
        <div class="text-center">
          <div class="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
            M
          </div>
          <h3 class="text-xl font-bold text-gray-800 mb-2">Magerly App</h3>
          <p class="text-sm text-gray-600 mb-6">Track • Learn • Celebrate</p>
        </div>
        
        <div class="space-y-3 text-gray-700">
          <div class="flex items-center space-x-3 p-2 bg-white rounded-lg shadow-sm cursor-pointer">
            <div class="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white text-lg" >📊</div>
            <div class="flex-1">
              <div class="font-semibold text-sm">Growth Tracking</div>
              <div class="text-xs text-gray-600">Height, weight & milestones</div>
            </div>
            <div class="text-green-500 text-xs">✓</div>
          </div>
          
          <div class="flex items-center space-x-3 p-2 bg-white rounded-lg shadow-sm cursor-pointer">
            <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white text-lg" >🎯</div>
            <div class="flex-1">
              <div class="font-semibold text-sm">Smart Reminders</div>
              <div class="text-xs text-gray-600">Never miss important stages</div>
            </div>
            <div class="text-blue-500 text-xs">NEW</div>
          </div>
          
          <div class="flex items-center space-x-3 p-2 bg-white rounded-lg shadow-sm cursor-pointer">
            <div class="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center text-white text-lg" >📸</div>
            <div class="flex-1">
              <div class="font-semibold text-sm">Memory Timeline</div>
              <div class="text-xs text-gray-600">Photos & precious moments</div>
            </div>
            <div class="text-purple-500 text-xs">❤️</div>
          </div>
        </div>
      </div>
    `;
  }
}

// Add more interactive animations throughout the site
function addInteractiveAnimations() {
  // Functionality disabled - no animations
}

// Enhanced download button functionality with smart device detection
function initDownloadButtons() {
  const platform = utils.detectPlatform();
  
  // Initialize smart app store buttons
  initSmartAppStoreButtons(platform);
  
  // Initialize all download buttons with click handlers
  const downloadButtons = document.querySelectorAll('[data-download-button]');
  
  downloadButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      
      const buttonPlatform = button.dataset.platform || platform;
      let downloadUrl;
      let storeName;
      
      if (buttonPlatform === 'ios') {
        downloadUrl = CONFIG.appStoreUrl;
        storeName = 'App Store';
      } else if (buttonPlatform === 'android') {
        downloadUrl = CONFIG.playStoreUrl;
        storeName = 'Play Store';
      } else {
        // Generic button - choose based on detected platform
        if (platform === 'ios') {
          downloadUrl = CONFIG.appStoreUrl;
          storeName = 'App Store';
        } else if (platform === 'android') {
          downloadUrl = CONFIG.playStoreUrl;
          storeName = 'Play Store';
        } else {
        downloadUrl = CONFIG.appStoreUrl;
        storeName = 'App Store';
        }
      }
      
      // Track download button click
      utils.trackEvent('download_button_click', {
        platform: buttonPlatform,
        detected_platform: platform,
        store: storeName,
        button_location: button.dataset.location || 'unknown'
      });
      
      // Open store in new tab
      window.open(downloadUrl, '_blank', 'noopener,noreferrer');
    });
  });
}

function initSmartAppStoreButtons(platform) {
  const iosBtn = document.getElementById('ios-download-btn');
  const androidBtn = document.getElementById('android-download-btn');
  const genericBtn = document.getElementById('generic-download-btn');
  
  if (!iosBtn || !androidBtn || !genericBtn) return;
  
  // App Store URLs
  const IOS_APP_URL = 'https://apps.apple.com/app/magerly/id6738602349';
  const ANDROID_APP_URL = 'https://play.google.com/store/apps/details?id=com.xxdsv.GrowingTogether';
  
  // Add click handlers to open app stores with enhanced tracking
  iosBtn.addEventListener('click', function() {
    const location = this.dataset.location || 'unknown';
    
    // Enhanced tracking
    utils.trackDownload('ios', location);
    
    // Legacy tracking for backwards compatibility
    utils.trackEvent('download_button_click', {
      platform: 'ios',
      location: location,
      button_id: this.id
    });
    
    // Open App Store
    window.open(IOS_APP_URL, '_blank');
  });
  
  androidBtn.addEventListener('click', function() {
    const location = this.dataset.location || 'unknown';
    
    // Enhanced tracking
    utils.trackDownload('android', location);
    
    // Legacy tracking for backwards compatibility
    utils.trackEvent('download_button_click', {
      platform: 'android',
      location: location,
      button_id: this.id
    });
    
    // Open Google Play
    window.open(ANDROID_APP_URL, '_blank');
  });
  
  genericBtn.addEventListener('click', function() {
    // Redirect to appropriate store based on device
    const detectedPlatform = utils.detectPlatform();
    const url = detectedPlatform === 'ios' ? IOS_APP_URL : 
                detectedPlatform === 'android' ? ANDROID_APP_URL : 
                IOS_APP_URL; // Default to iOS
    
    const location = 'generic';
    
    // Enhanced tracking
    utils.trackDownload(detectedPlatform, location);
    
    // Legacy tracking
    utils.trackEvent('download_button_click', {
      platform: detectedPlatform,
      location: location,
      button_id: this.id
    });
    
    // Open store
    window.open(url, '_blank');
  });
  
  // Smart display logic based on platform
  if (platform === 'ios') {
    // Show iOS button prominently, hide others
    iosBtn.classList.remove('hidden');
    iosBtn.classList.add('primary-cta');
    androidBtn.classList.add('hidden');
    genericBtn.classList.add('hidden');
    
    // Add priority styling
    iosBtn.classList.add('ring-2', 'ring-yellow-400', 'ring-opacity-50');
    
    // Update iOS button text for emphasis
    const iosText = iosBtn.querySelector('.text-lg');
    if (iosText) iosText.textContent = 'App Store';
    
  } else if (platform === 'android') {
    // Show Android button prominently, hide others
    androidBtn.classList.remove('hidden');
    androidBtn.classList.add('primary-cta');
    iosBtn.classList.add('hidden');
    genericBtn.classList.add('hidden');
    
    // Add priority styling
    androidBtn.classList.add('ring-2', 'ring-yellow-400', 'ring-opacity-50');
    
    // Update Android button text for emphasis
    const androidText = androidBtn.querySelector('.text-lg');
    if (androidText) androidText.textContent = 'Google Play';
    
  } else {
    // Desktop - show both buttons equally
    if (window.innerWidth >= 640) { // sm breakpoint
      iosBtn.classList.remove('hidden');
      androidBtn.classList.remove('hidden');
      genericBtn.classList.add('hidden');
    } else {
      // Mobile fallback - show generic button
      iosBtn.classList.add('hidden');
      androidBtn.classList.add('hidden');
      genericBtn.classList.remove('hidden');
    }
  }
  
  // Add accessibility labels
  iosBtn.setAttribute('aria-label', 'Download Magerly on the App Store for iPhone and iPad');
  androidBtn.setAttribute('aria-label', 'Get Magerly on Google Play for Android devices');
  genericBtn.setAttribute('aria-label', 'Download Magerly mobile app for your device');

}

function getVisibleButtons(buttons) {
  return buttons
    .filter(btn => !btn.classList.contains('hidden'))
    .map(btn => btn.id)
    .join(',');
}

// Enhanced Age Calculator with Milestones
class BabyAgeCalculator {
  constructor() {
    this.form = document.getElementById('baby-age-form');
    this.birthDateInput = document.getElementById('baby-birth-date');
    this.resultsContainer = document.getElementById('age-calculator-results');
    this.errorContainer = document.getElementById('birth-date-error');
    this.returnVisitorWelcome = document.getElementById('return-visitor-welcome');
    
    this.milestoneDatabase = this.loadMilestoneDatabase();
    this.init();
  }
  
  init() {
    if (!this.form || !this.birthDateInput) return;
    
    this.form.addEventListener('submit', this.handleSubmit.bind(this));
    this.birthDateInput.addEventListener('change', this.handleDateChange.bind(this));
    
    // Load stored data for returning visitors
    this.loadStoredData();
    
    // Set max date to today
    this.birthDateInput.max = new Date().toISOString().split('T')[0];
  }
  
  handleSubmit(event) {
    event.preventDefault();
    
    const birthDate = new Date(this.birthDateInput.value);
    if (this.validateDate(birthDate)) {
      this.showLoadingState();
      
      // Add small delay for better UX
      setTimeout(() => {
        const age = this.calculatePreciseAge(birthDate);
        this.displayResults(age);
        this.storeData(birthDate);
        this.trackCalculatorUsage(age);
      }, 300);
    }
  }
  
  handleDateChange() {
    // Hide error when user starts typing
    this.hideError();
    
    // Hide return visitor welcome
    if (this.returnVisitorWelcome) {
      this.returnVisitorWelcome.classList.add('hidden');
    }
  }
  
  calculatePreciseAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    
    // Calculate total days
    const diffTime = today - birth;
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // Calculate years, months, days
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();
    
    if (days < 0) {
      months--;
      const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += prevMonth.getDate();
    }
    
    if (months < 0) {
      years--;
      months += 12;
    }
    
    // Calculate total months for milestone lookup
    const totalMonths = years * 12 + months;
    
    return {
      years,
      months,
      days,
      totalDays,
      totalMonths,
      birthDate: birth
    };
  }
  
  validateDate(date) {
    const today = new Date();
    const fiveYearsAgo = new Date();
    fiveYearsAgo.setFullYear(today.getFullYear() - 5);
    
    if (isNaN(date.getTime())) {
      this.showError('Please enter a valid birth date');
      return false;
    }
    
    if (date > today) {
      this.showError('Birth date cannot be in the future');
      return false;
    }
    
    if (date < fiveYearsAgo) {
      this.showError('This calculator is designed for babies up to 5 years old');
      return false;
    }
    
    this.hideError();
    return true;
  }
  
  showLoadingState() {
    const button = document.getElementById('calculate-baby-age');
    const icon = document.getElementById('calculate-icon');
    const text = document.getElementById('calculate-text');
    
    if (button && icon && text) {
      button.disabled = true;
      icon.textContent = '⏳';
      text.textContent = 'Calculating...';
    }
  }
  
  displayResults(age) {
    // Store age globally for CTA tracking
    window.calculatedAge = age;
    
    // Hide return visitor welcome
    if (this.returnVisitorWelcome) {
      this.returnVisitorWelcome.classList.add('hidden');
    }
    
    // Reset button state
    this.resetButtonState();
    
    // Format age display
    this.updateAgeDisplay(age);
    
    // Display relevant milestones
    this.displayMilestones(age);
    
    // Update personalized message
    this.updatePersonalizedMessage(age);
    
    // Add data management options
    this.addDataManagementOptions();
    
    // Show results with enhanced animation
    this.resultsContainer.classList.remove('hidden');
    this.resultsContainer.classList.add('animate-fade-in-up');
    
    // Add celebration animation for new calculations
    this.showCelebrationAnimation();
    
    // Scroll to results
    setTimeout(() => {
      this.resultsContainer.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'nearest' 
      });
    }, 100);
  }
  
  addDataManagementOptions() {
    // Add change date and clear data options
    const existingOptions = document.getElementById('data-management-options');
    if (existingOptions) {
      existingOptions.remove();
    }
    
    const optionsDiv = document.createElement('div');
    optionsDiv.id = 'data-management-options';
    optionsDiv.className = 'mt-4 p-3 bg-gray-50 rounded-lg border-l-4 border-blue-400';
    optionsDiv.innerHTML = `
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2 text-sm text-gray-700">
          <span>💾</span>
          <span>We've saved your baby's birthday for next time</span>
        </div>
        <div class="flex items-center space-x-3">
          <button onclick="document.getElementById('baby-birth-date').focus(); document.getElementById('baby-birth-date').select()" 
                  class="text-blue-600 hover:text-blue-800 text-xs underline transition-colors">
            Change Date
          </button>
          <button onclick="window.babyAgeCalculator?.clearStoredData()" 
                  class="text-red-600 hover:text-red-800 text-xs underline transition-colors"
                  title="Clear saved data and start fresh">
            Clear Data
          </button>
        </div>
      </div>
    `;
    
    this.resultsContainer.appendChild(optionsDiv);
    
    // Make calculator instance globally accessible
    window.babyAgeCalculator = this;
  }
  
  showCelebrationAnimation() {
    // Create floating confetti-style elements
    const celebrations = ['🎉', '✨', '🌟', '💫', '🎊'];
    const calculatorSection = document.getElementById('age-calculator');
    
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const emoji = celebrations[Math.floor(Math.random() * celebrations.length)];
        const element = document.createElement('div');
        element.textContent = emoji;
        element.className = 'fixed text-2xl pointer-events-none z-10';
        element.style.left = Math.random() * 100 + '%';
        element.style.top = '50%';
        element.style.transform = 'translateY(-50%)';
        
        calculatorSection.appendChild(element);
        
        // Animate and remove
        setTimeout(() => {
          element.style.transition = 'all 2s ease-out';
          element.style.transform = 'translateY(-200px) scale(0.3)';
          element.style.opacity = '0';
          
          setTimeout(() => {
            element.remove();
          }, 2000);
        }, 100);
      }, i * 200);
    }
  }
  
  updateAgeDisplay(age) {
    const ageDisplay = document.getElementById('baby-age-display');
    const exactAgeDisplay = document.getElementById('exact-age-display');
    const nextMilestonePreview = document.getElementById('next-milestone-preview');
    
    if (!ageDisplay || !exactAgeDisplay) return;
    
    // Format main age text
    let ageText = '';
    if (age.years > 0) {
      ageText = `${age.years} year${age.years !== 1 ? 's' : ''}`;
      if (age.months > 0) {
        ageText += ` and ${age.months} month${age.months !== 1 ? 's' : ''}`;
      }
    } else if (age.months > 0) {
      ageText = `${age.months} month${age.months !== 1 ? 's' : ''}`;
      if (age.days > 7) {
        const weeks = Math.floor(age.days / 7);
        ageText += ` and ${weeks} week${weeks !== 1 ? 's' : ''}`;
      }
    } else if (age.days > 0) {
      if (age.days === 1) {
        ageText = '1 day';
      } else if (age.days < 7) {
        ageText = `${age.days} days`;
      } else {
        const weeks = Math.floor(age.days / 7);
        const remainingDays = age.days % 7;
        ageText = `${weeks} week${weeks !== 1 ? 's' : ''}`;
        if (remainingDays > 0) {
          ageText += ` and ${remainingDays} day${remainingDays !== 1 ? 's' : ''}`;
        }
      }
    } else {
      ageText = 'Just born today! 🎉';
    }
    
    ageDisplay.textContent = ageText;
    exactAgeDisplay.textContent = `That's ${age.totalDays} day${age.totalDays !== 1 ? 's' : ''} of precious moments!`;
    
    // Show next milestone preview
    const nextMilestone = this.getNextMilestone(age.totalMonths);
    if (nextMilestone && nextMilestonePreview) {
      nextMilestonePreview.textContent = `Next milestone: ${nextMilestone.title} (${nextMilestone.ageRange})`;
    }
  }
  
  displayMilestones(age) {
    const milestoneContent = document.getElementById('milestone-content');
    if (!milestoneContent) return;
    
    const relevantMilestones = this.getMilestonesForAge(age.totalMonths);
    
    if (relevantMilestones.length === 0) {
      milestoneContent.innerHTML = `
        <div class="text-center py-8 text-gray-500">
          <div class="text-4xl mb-4">🌟</div>
          <p>Every baby develops at their own pace. Keep celebrating the small moments!</p>
        </div>
      `;
      return;
    }
    
    milestoneContent.innerHTML = relevantMilestones.map((milestone, index) => `
      <div class="milestone-card border-l-4 border-primary-400 bg-white p-4 rounded-r-lg shadow-sm cursor-pointer group"
           
           onclick="this.classList.toggle('expanded')">
        <div class="flex items-start space-x-3">
          <div class="text-2xl mt-1 group-hover:animate-bounce">${milestone.emoji}</div>
          <div class="flex-1">
            <h5 class="font-semibold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">${milestone.title}</h5>
            <p class="text-gray-600 text-sm mb-2">${milestone.description}</p>
            <div class="flex items-center justify-between">
              <span class="inline-block bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full font-medium">
                ${milestone.ageRange}
              </span>
              <div class="flex items-center space-x-2">
                ${milestone.isComplete ? 
                  '<span class="text-green-600 text-xs font-medium">✓ Likely achieved</span>' : 
                  '<span class="text-blue-600 text-xs font-medium">⏳ Coming soon</span>'
                }
                <span class="text-gray-400 text-xs group-hover:text-primary-600 transition-colors">👆 Click for tips</span>
              </div>
            </div>
            <div class="expanded-content hidden mt-3 p-3 bg-primary-50 rounded-lg border">
              <h6 class="font-medium text-primary-800 mb-2">💡 How to encourage this milestone:</h6>
              <p class="text-sm text-primary-700">${this.getMilestoneTips(milestone.title)}</p>
            </div>
          </div>
        </div>
      </div>
    `).join('');
    
    // Add click handlers for expanding milestone cards
    setTimeout(() => {
      document.querySelectorAll('.milestone-card').forEach(card => {
        card.addEventListener('click', function() {
          const expandedContent = this.querySelector('.expanded-content');
          if (expandedContent.classList.contains('hidden')) {
            expandedContent.classList.remove('hidden');
            expandedContent.classList.add('animate-slide-down');
            this.classList.add('expanded');
          } else {
            expandedContent.classList.add('hidden');
            expandedContent.classList.remove('animate-slide-down');
            this.classList.remove('expanded');
          }
        });
      });
    }, 500);
  }
  
  getMilestonesForAge(ageInMonths) {
    // Get milestones for current age range and upcoming ones
    const currentMilestones = this.milestoneDatabase.filter(milestone => 
      ageInMonths >= milestone.minAgeMonths && ageInMonths <= milestone.maxAgeMonths
    );
    
    const upcomingMilestones = this.milestoneDatabase.filter(milestone => 
      milestone.minAgeMonths > ageInMonths && milestone.minAgeMonths <= ageInMonths + 6
    );
    
    // Mark completed milestones
    const allRelevantMilestones = [
      ...currentMilestones.map(m => ({ ...m, isComplete: true })),
      ...upcomingMilestones.slice(0, 2).map(m => ({ ...m, isComplete: false }))
    ];
    
    return allRelevantMilestones.slice(0, 4); // Show max 4 milestones
  }
  
  getNextMilestone(ageInMonths) {
    return this.milestoneDatabase
      .filter(milestone => milestone.minAgeMonths > ageInMonths)
      .sort((a, b) => a.minAgeMonths - b.minAgeMonths)[0];
  }
  
  updatePersonalizedMessage(age) {
    const messageElement = document.getElementById('personalized-message');
    if (!messageElement) return;
    
    let message = '';
    if (age.totalMonths < 6) {
      message = `Perfect timing! Track those precious early milestones and get expert guidance for your ${age.totalMonths}-month-old baby.`;
    } else if (age.totalMonths < 12) {
      message = `Your baby is in an exciting development phase! Get personalized insights for their ${age.totalMonths}-month milestones.`;
    } else if (age.totalMonths < 24) {
      message = `Toddler adventures ahead! Track your ${Math.floor(age.totalMonths/12)}-year-old's growth and celebrate every achievement.`;
    } else {
      message = `Keep celebrating your growing child! Get expert advice tailored for ${Math.floor(age.totalMonths/12)}-year-olds.`;
    }
    
    messageElement.textContent = message;
  }
  
  resetButtonState() {
    const button = document.getElementById('calculate-baby-age');
    const icon = document.getElementById('calculate-icon');
    const text = document.getElementById('calculate-text');
    
    if (button && icon && text) {
      button.disabled = false;
      icon.textContent = '🎉';
      text.textContent = 'Recalculate';
    }
  }
  
  getMilestoneTips(milestoneTitle) {
    const tips = {
      'First Smiles': 'Talk to your baby frequently, make eye contact, and smile often. Play peek-a-boo and respond enthusiastically to their attempts to smile.',
      'Head Control': 'Give your baby plenty of supervised tummy time. Support them during feeding and play to help strengthen neck muscles.',
      'Rolling Over': 'Encourage tummy time and place interesting toys just out of reach to motivate movement. Always supervise and ensure a safe surface.',
      'Sitting Supported': 'Use pillows for support during sitting practice. Engage with toys at eye level to encourage balance and core strength.',
      'Babbling': 'Talk back when your baby babbles, repeat their sounds, and introduce new sounds. Read books together and narrate your daily activities.',
      'Sitting Independently': 'Practice short sitting sessions with toys within reach. Be patient and celebrate small improvements in balance.',
      'Crawling': 'Create safe crawling spaces and place favorite toys just out of reach. Get down on the floor and crawl together!',
      'Pulling to Stand': 'Provide sturdy furniture at the right height. Babyproof sharp corners and ensure the area is safe for falls.',
      'First Words': 'Repeat words often, respond to their attempts to communicate, and read together daily. Name objects and actions throughout the day.',
      'Walking': 'Encourage cruising along furniture, provide stable push toys, and ensure floors are safe. Avoid using walkers.',
      'Two-Word Phrases': 'Expand on their single words by adding descriptive words. Read books with simple sentences and repeat key phrases.',
      'Running': 'Provide safe spaces for active play. Visit parks and open areas where they can practice running and coordination.',
      'Potty Training': 'Watch for signs of readiness, maintain consistent routines, and be patient with accidents. Celebrate small successes!',
      'Playing with Others': 'Arrange playdates, visit playgrounds, and model sharing and cooperation. Praise positive social interactions.'
    };
    
    return tips[milestoneTitle] || 'Every baby develops at their own pace. Continue providing love, encouragement, and appropriate stimulation for healthy development.';
  }
  
  loadMilestoneDatabase() {
    return [
      {
        title: "First Smiles",
        description: "Your baby should be showing social smiles and responding to familiar faces with joy.",
        emoji: "😊",
        ageRange: "6-8 weeks",
        minAgeMonths: 1.5,
        maxAgeMonths: 2
      },
      {
        title: "Head Control", 
        description: "Baby can hold their head steady when supported and during tummy time.",
        emoji: "💪",
        ageRange: "2-4 months",
        minAgeMonths: 2,
        maxAgeMonths: 4
      },
      {
        title: "Rolling Over",
        description: "Baby learns to roll from tummy to back, then back to tummy.",
        emoji: "🤸‍♀️",
        ageRange: "4-6 months", 
        minAgeMonths: 4,
        maxAgeMonths: 6
      },
      {
        title: "Sitting Supported",
        description: "Baby can sit with support and shows good balance when propped up.",
        emoji: "🪑",
        ageRange: "4-7 months",
        minAgeMonths: 4,
        maxAgeMonths: 7
      },
      {
        title: "Babbling",
        description: "Baby makes consonant-vowel combinations like 'ba-ba' or 'da-da'.",
        emoji: "🗣️",
        ageRange: "5-8 months",
        minAgeMonths: 5,
        maxAgeMonths: 8
      },
      {
        title: "Sitting Independently", 
        description: "Baby can sit without support for several minutes at a time.",
        emoji: "🧘‍♀️",
        ageRange: "6-9 months",
        minAgeMonths: 6,
        maxAgeMonths: 9
      },
      {
        title: "Crawling",
        description: "Baby moves around by crawling, creeping, or bottom shuffling.",
        emoji: "🐛",
        ageRange: "7-11 months",
        minAgeMonths: 7,
        maxAgeMonths: 11
      },
      {
        title: "Pulling to Stand",
        description: "Baby pulls themselves up to standing position using furniture for support.",
        emoji: "🧍‍♀️",
        ageRange: "8-12 months", 
        minAgeMonths: 8,
        maxAgeMonths: 12
      },
      {
        title: "First Words",
        description: "Baby says their first meaningful words like 'mama' or 'dada' consistently.",
        emoji: "👶",
        ageRange: "10-14 months",
        minAgeMonths: 10,
        maxAgeMonths: 14
      },
      {
        title: "Walking",
        description: "Baby takes their first independent steps without support.",
        emoji: "👣",
        ageRange: "12-18 months",
        minAgeMonths: 12,
        maxAgeMonths: 18
      },
      {
        title: "Two-Word Phrases",
        description: "Toddler combines two words to express needs, like 'more milk' or 'bye-bye'.",
        emoji: "💬", 
        ageRange: "18-24 months",
        minAgeMonths: 18,
        maxAgeMonths: 24
      },
      {
        title: "Running",
        description: "Toddler can run with confidence and rarely falls while moving fast.",
        emoji: "🏃‍♀️",
        ageRange: "20-30 months",
        minAgeMonths: 20,
        maxAgeMonths: 30
      },
      {
        title: "Potty Training",
        description: "Toddler shows readiness for potty training and can communicate their needs.",
        emoji: "🚽",
        ageRange: "24-36 months",
        minAgeMonths: 24,
        maxAgeMonths: 36
      },
      {
        title: "Playing with Others",
        description: "Child engages in cooperative play and shares toys with other children.",
        emoji: "🤝",
        ageRange: "30-42 months",
        minAgeMonths: 30,
        maxAgeMonths: 42
      }
    ];
  }
  
  storeData(birthDate) {
    try {
      const data = {
        birthDate: birthDate.toISOString(),
        lastCalculated: new Date().toISOString(),
        calculationCount: this.getCalculationCount() + 1
      };
      
      localStorage.setItem('magerly_baby_data', JSON.stringify(data));
      localStorage.setItem('magerly_calculator_used', Date.now().toString());
    } catch (error) {
      console.warn('Unable to store calculator data:', error);
    }
  }
  
  loadStoredData() {
    try {
      const storedData = localStorage.getItem('magerly_baby_data');
      if (storedData) {
        const data = JSON.parse(storedData);
        const birthDate = new Date(data.birthDate);
        
        // Pre-fill the date input
        this.birthDateInput.value = birthDate.toISOString().split('T')[0];
        
        // Show enhanced welcome message for returning visitors
        if (this.returnVisitorWelcome && data.calculationCount > 0) {
          this.showReturnVisitorExperience(data, birthDate);
        }
        
        // Auto-calculate for seamless experience
        if (data.calculationCount > 1) {
          setTimeout(() => {
            this.handleSubmit({ preventDefault: () => {} });
          }, 1000);
        }
      }
    } catch (error) {
      console.warn('Unable to load stored calculator data:', error);
    }
  }
  
  showReturnVisitorExperience(data, birthDate) {
    const age = this.calculatePreciseAge(birthDate);
    const daysSinceLastCalc = Math.floor((Date.now() - new Date(data.lastCalculated)) / (1000 * 60 * 60 * 24));
    
    // Create enhanced welcome message
    this.returnVisitorWelcome.innerHTML = `
      <div class="flex items-start space-x-3">
        <div class="text-2xl-gentle">👋</div>
        <div class="flex-1">
          <div class="flex items-center justify-between mb-2">
            <span class="font-semibold text-green-800">Welcome back!</span>
            <button onclick="this.closest('#return-visitor-welcome').classList.add('hidden'); document.getElementById('baby-birth-date').focus()" 
                    class="text-green-600 hover:text-green-800 text-sm underline"
                    aria-label="Change baby's birthday">
              Change date
            </button>
          </div>
          <p class="text-green-700 text-sm mb-2">
            Your baby is now <strong>${this.formatAgeForWelcome(age)}</strong>
            ${daysSinceLastCalc > 0 ? `(${daysSinceLastCalc} day${daysSinceLastCalc !== 1 ? 's' : ''} since your last visit!)` : ''}
          </p>
          <div class="flex items-center space-x-2 text-xs text-green-600">
            <span>📊</span>
            <span>Calculating updated milestones...</span>
            <div class="animate-spin rounded-full h-3 w-3 border-b-2 border-green-600"></div>
          </div>
        </div>
      </div>
    `;
    
    this.returnVisitorWelcome.classList.remove('hidden');
    
    // Add slide-in animation
    this.returnVisitorWelcome.classList.add('animate-slide-in-up');
  }
  
  formatAgeForWelcome(age) {
    if (age.years > 0) {
      return `${age.years} year${age.years !== 1 ? 's' : ''} and ${age.months} month${age.months !== 1 ? 's' : ''} old`;
    } else if (age.months > 0) {
      return `${age.months} month${age.months !== 1 ? 's' : ''} old`;
    } else {
      return `${age.days} day${age.days !== 1 ? 's' : ''} old`;
    }
  }
  
  clearStoredData() {
    try {
      localStorage.removeItem('magerly_baby_data');
      localStorage.removeItem('magerly_calculator_used');
      if (this.returnVisitorWelcome) {
        this.returnVisitorWelcome.classList.add('hidden');
      }
      this.birthDateInput.value = '';
      this.resultsContainer.classList.add('hidden');
      
      // Show confirmation
      const confirmation = document.createElement('div');
      confirmation.className = 'fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      confirmation.textContent = 'Data cleared! You can enter a new birthday.';
      document.body.appendChild(confirmation);
      
      setTimeout(() => {
        confirmation.remove();
      }, 3000);
      
    } catch (error) {
      console.warn('Unable to clear stored data:', error);
    }
  }
  
  getCalculationCount() {
    try {
      const storedData = localStorage.getItem('magerly_baby_data');
      if (storedData) {
        const data = JSON.parse(storedData);
        return data.calculationCount || 0;
      }
    } catch (error) {
      console.warn('Unable to get calculation count:', error);
    }
    return 0;
  }
  
  showError(message) {
    if (this.errorContainer) {
      this.errorContainer.textContent = message;
      this.errorContainer.classList.remove('hidden');
    }
  }
  
  hideError() {
    if (this.errorContainer) {
      this.errorContainer.classList.add('hidden');
    }
  }
}

// Initialize age calculator
function initAgeCalculator() {
  const calculator = new BabyAgeCalculator();
   
  return calculator;
}

// Smooth scrolling for navigation links
// Enhanced navigation functionality
class NavigationController {
  constructor() {
    this.header = null;
    this.mobileMenuButton = null;
    this.mobileMenu = null;
    this.isMenuOpen = false;
    this.lastScrollY = window.scrollY;
    
    this.init();
  }
  
  init() {
    this.header = document.querySelector('nav[role="navigation"]') || document.querySelector('header nav');
    this.mobileMenuButton = document.getElementById('mobile-menu-button');
    this.mobileMenu = document.getElementById('mobile-menu-overlay');
    
    // Initialize smooth scrolling
    this.initSmoothScrolling();
    
    // Initialize mobile menu
    this.initMobileMenu();
    
    // Initialize header scroll effects
    this.initScrollEffects();
    
    // Initialize keyboard navigation
    this.initKeyboardNavigation();
    
  }
  
  initSmoothScrolling() {
  const navLinks = document.querySelectorAll('a[href^="#"]');
  
  navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
      e.preventDefault();
        
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          // Close mobile menu if open
          this.closeMobileMenu();
          
          // Smooth scroll to target
          const headerHeight = this.header ? this.header.offsetHeight : 0;
          const targetPosition = targetElement.offsetTop - headerHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          // Update URL hash without jumping
          history.replaceState(null, null, `#${targetId}`);
      
      // Track navigation click
      utils.trackEvent('navigation_click', {
            target_section: targetId,
            source: 'navigation_menu'
          });
          
          // Focus the target element for accessibility
          setTimeout(() => {
            targetElement.setAttribute('tabindex', '-1');
            targetElement.focus({preventScroll: true});
          }, 500);
        }
      });
    });
  }
  
  initMobileMenu() {
    if (!this.mobileMenuButton || !this.mobileMenu) return;
    
    // Mobile menu toggle
    this.mobileMenuButton.addEventListener('click', () => {
      this.toggleMobileMenu();
    });
    
    // Close menu when clicking outside
    this.mobileMenu.addEventListener('click', (e) => {
      if (e.target === this.mobileMenu) {
        this.closeMobileMenu();
      }
    });
    
    // Close menu with escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isMenuOpen) {
        this.closeMobileMenu();
      }
    });
    
    // Close menu button
    const closeButton = this.mobileMenu.querySelector('#mobile-menu-close');
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        this.closeMobileMenu();
      });
    }
    
    // Close menu when navigation links are clicked
    const mobileNavLinks = this.mobileMenu.querySelectorAll('a');
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.closeMobileMenu();
      });
    });
  }
  
  toggleMobileMenu() {
    if (this.isMenuOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }
  
  openMobileMenu() {
    this.mobileMenu.classList.remove('hidden');
    this.mobileMenu.setAttribute('aria-hidden', 'false');
    this.mobileMenuButton.setAttribute('aria-expanded', 'true');
    this.isMenuOpen = true;
    
    // Trap focus in mobile menu
    this.trapFocus();
    
    // Track menu open
    utils.trackEvent('mobile_menu_opened');
  }
  
  closeMobileMenu() {
    if (!this.isMenuOpen) return;
    
    this.mobileMenu.classList.add('hidden');
    this.mobileMenu.setAttribute('aria-hidden', 'true');
    this.mobileMenuButton.setAttribute('aria-expanded', 'false');
    this.isMenuOpen = false;
    
    // Return focus to menu button
    this.mobileMenuButton.focus();
  }
  
  trapFocus() {
    const focusableElements = this.mobileMenu.querySelectorAll(
      'a, button, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    // Focus first element when menu opens
    setTimeout(() => firstElement?.focus(), 100);
    
    // Handle tab navigation within menu
    this.mobileMenu.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          // Shift+Tab
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    });
  }
  
  initScrollEffects() {
    if (!this.header) return;
    
    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      
      // Add scrolled styling when scrolled
      if (currentScrollY > 10) {
        this.header.classList.add('header-scrolled');
      } else {
        this.header.classList.remove('header-scrolled');
      }
      
      // Update active navigation item based on scroll position
      this.updateActiveNavOnScroll();
      
      this.lastScrollY = currentScrollY;
    });
  }
  
  initKeyboardNavigation() {
    // Add keyboard support for all navigation links
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
      link.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          link.click();
        }
      });
    });
  }
  
  updateActiveNavOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    let current = '';
    const scrollPosition = window.scrollY + 150; // Offset for header
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('text-primary-600');
      link.removeAttribute('aria-current');
      
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('text-primary-600');
        link.setAttribute('aria-current', 'location');
      }
    });
  }
}

function initSmoothScrolling() {
  // Enhanced navigation is now handled by NavigationController
  new NavigationController();
}

// Carousel functionality
class CarouselController {
  constructor() {
    this.track = document.getElementById('carousel-track');
    this.prevButton = document.getElementById('carousel-prev');
    this.nextButton = document.getElementById('carousel-next');
    this.container = document.getElementById('carousel-container');
    this.slides = document.querySelectorAll('.carousel-slide');
    this.currentSlide = 0;
    this.totalSlides = this.slides.length;
    this.itemsPerView = this.getItemsPerView();

    this.init();
  }

  init() {
    if (!this.track || !this.prevButton || !this.nextButton || this.totalSlides === 0) return;

    // Set up button click handlers
    this.prevButton.addEventListener('click', () => this.prevSlide());
    this.nextButton.addEventListener('click', () => this.nextSlide());

    // Handle window resize to update items per view
    window.addEventListener('resize', () => {
      const newItemsPerView = this.getItemsPerView();
      if (newItemsPerView !== this.itemsPerView) {
        this.itemsPerView = newItemsPerView;
        this.updateCarousel();
      }
    });

    // Auto-advance carousel every 8 seconds
    setInterval(() => this.nextSlide(), 8000);

    // Initialize display
    this.updateCarousel();
  }

  getItemsPerView() {
    // Determine items to show based on window width
    const width = window.innerWidth;
    if (width < 768) {
      return 1; // Mobile: 1 item
    } else if (width < 1024) {
      return 2; // Tablet: 2 items
    } else {
      return 3; // Desktop: 3 items
    }
  }

  goToSlide(n) {
    this.currentSlide = Math.min(n, this.totalSlides - this.itemsPerView);
    this.currentSlide = Math.max(0, this.currentSlide);
    this.updateCarousel();
  }

  prevSlide() {
    this.currentSlide = Math.max(0, this.currentSlide - 1);
    this.updateCarousel();
  }

  nextSlide() {
    const maxSlide = Math.max(0, this.totalSlides - this.itemsPerView);
    this.currentSlide = Math.min(maxSlide, this.currentSlide + 1);
    this.updateCarousel();
  }

  updateCarousel() {
    // Calculate percentage offset based on items per view
    const percentPerSlide = (100 / this.itemsPerView);
    const offset = -this.currentSlide * percentPerSlide;
    this.track.style.transform = `translateX(${offset}%)`;
  }
}

function initCarousel() {
  new CarouselController();
}

// Helper function to show messages
function showMessage(messageDiv, message, type = 'info') {
  if (!messageDiv) return;
  
  const bgColor = type === 'error' ? 'bg-red-100' : 
                  type === 'success' ? 'bg-green-100' : 'bg-blue-100';
  const textColor = type === 'error' ? 'text-red-800' : 
                    type === 'success' ? 'text-green-800' : 'text-blue-800';
  
  messageDiv.innerHTML = `
    <div class="${bgColor} ${textColor} p-3 rounded-lg mb-4">
      ${message}
    </div>
  `;
  
  // Auto-hide after 5 seconds
  setTimeout(() => {
    messageDiv.innerHTML = '';
  }, 5000);
}

// Footer functionality
function initFooter() {
  // Update copyright year
  updateCopyrightYear();
  
  // Initialize social media links
  initSocialMediaLinks();
  
  // Add footer accessibility enhancements
  enhanceFooterAccessibility();
}

function updateCopyrightYear() {
  const currentYear = new Date().getFullYear();
  const copyrightElements = document.querySelectorAll('[data-copyright-year], .copyright-year');
  
  copyrightElements.forEach(element => {
    // Replace the year in the text content
    element.textContent = element.textContent.replace(/\d{4}/, currentYear);
  });
  
  // Also handle cases where we just need to set the year directly
  const yearElements = document.querySelectorAll('[data-year]');
  yearElements.forEach(element => {
    element.textContent = currentYear;
  });
}

function initSocialMediaLinks() {
  const socialLinks = document.querySelectorAll('footer a[href*="facebook"], footer a[href*="twitter"], footer a[href*="instagram"], footer a[href*="linkedin"]');
  
  socialLinks.forEach(link => {
    // Ensure external social links open in new tab with security attributes
    if (link.hostname !== window.location.hostname) {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
      
      // Add screen reader text for external links
      const srText = document.createElement('span');
      srText.className = 'sr-only';
      srText.textContent = ' (opens in new tab)';
      link.appendChild(srText);
    }
    
    // Track social media clicks
    link.addEventListener('click', function() {
      const platform = getSocialPlatform(this.href);
      utils.trackEvent('social_media_click', {
        platform: platform,
        location: 'footer'
      });
    });
  });
}

function getSocialPlatform(url) {
  if (url.includes('facebook')) return 'facebook';
  if (url.includes('instagram')) return 'instagram';
  return 'unknown';
}

function enhanceFooterAccessibility() {
  const footer = document.querySelector('footer');
  if (!footer) return;
  
  // Add landmark role if not present
  if (!footer.getAttribute('role')) {
    footer.setAttribute('role', 'contentinfo');
  }
  
  // Add better structure to footer navigation
  const footerNavSections = footer.querySelectorAll('h3');
  footerNavSections.forEach((heading, index) => {
    const headingId = `footer-section-${index}`;
    heading.id = headingId;
    
    // Find the associated list and add aria-labelledby
    const nextElement = heading.nextElementSibling;
    if (nextElement && nextElement.tagName === 'UL') {
      nextElement.setAttribute('aria-labelledby', headingId);
    }
  });
}

// Export for use in other modules if needed
window.MagerlyApp = {
  utils,
  CONFIG
};
