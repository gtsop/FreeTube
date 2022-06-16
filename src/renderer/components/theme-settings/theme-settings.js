import Vue from 'vue'
import { mapActions } from 'vuex'
import FtCard from '../ft-card/ft-card.vue'
import FtSelect from '../ft-select/ft-select.vue'
import FtToggleSwitch from '../ft-toggle-switch/ft-toggle-switch.vue'
import FtSlider from '../ft-slider/ft-slider.vue'
import FtFlexBox from '../ft-flex-box/ft-flex-box.vue'
import FtPrompt from '../ft-prompt/ft-prompt.vue'

export default Vue.extend({
  name: 'ThemeSettings',
  components: {
    'ft-card': FtCard,
    'ft-select': FtSelect,
    'ft-toggle-switch': FtToggleSwitch,
    'ft-slider': FtSlider,
    'ft-flex-box': FtFlexBox,
    'ft-prompt': FtPrompt
  },
  data: function () {
    return {
      minUiScale: 50,
      maxUiScale: 300,
      uiScaleStep: 5,
      disableSmoothScrollingToggleValue: false,
      disableHardwareAccelerationToggleValue: false,
      showRestartPrompt: false,
      showRestartPromptAcc: false,
      restartPromptValues: [
        'yes',
        'no'
      ],
      baseThemeValues: [
        'system',
        'light',
        'dark',
        'black',
        'dracula'
      ]
    }
  },
  computed: {
    barColor: function () {
      return this.$store.getters.getBarColor
    },

    baseTheme: function () {
      return this.$store.getters.getBaseTheme
    },

    mainColor: function () {
      return this.$store.getters.getMainColor
    },

    secColor: function () {
      return this.$store.getters.getSecColor
    },

    isSideNavOpen: function () {
      return this.$store.getters.getIsSideNavOpen
    },

    uiScale: function () {
      return this.$store.getters.getUiScale
    },

    disableSmoothScrolling: function () {
      return this.$store.getters.getDisableSmoothScrolling
    },

    disableHardwareAcceleration: function () {
      return this.$store.getters.getDisableHardwareAcceleration
    },

    expandSideBar: function () {
      return this.$store.getters.getExpandSideBar
    },

    hideLabelsSideBar: function () {
      return this.$store.getters.getHideLabelsSideBar
    },

    restartPromptMessage: function () {
      return this.$t('Settings["The app needs to restart for changes to take effect. Restart and apply change?"]')
    },

    restartPromptNames: function () {
      return [
        this.$t('Yes'),
        this.$t('No')
      ]
    },

    baseThemeNames: function () {
      return [
        this.$t('Settings.Theme Settings.Base Theme.System Default'),
        this.$t('Settings.Theme Settings.Base Theme.Light'),
        this.$t('Settings.Theme Settings.Base Theme.Dark'),
        this.$t('Settings.Theme Settings.Base Theme.Black'),
        this.$t('Settings.Theme Settings.Base Theme.Dracula')
      ]
    },

    colorValues: function () {
      return this.$store.getters.getColorNames
    },

    colorNames: function () {
      return this.colorValues.map(colorVal => {
        // add spaces before capital letters
        const colorName = colorVal.replace(/([A-Z])/g, ' $1').trim()
        return this.$t(`Settings.Theme Settings.Main Color Theme.${colorName}`)
      })
    }
  },
  mounted: function () {
    this.disableSmoothScrollingToggleValue = this.disableSmoothScrolling
    this.disableHardwareAccelerationToggleValue = this.disableHardwareAcceleration
  },
  methods: {
    handleExpandSideBar: function (value) {
      if (this.isSideNavOpen !== value) {
        this.$store.commit('toggleSideNav')
      }

      this.updateExpandSideBar(value)
    },

    handleRestartPrompt: function (value) {
      this.disableSmoothScrollingToggleValue = value
      this.showRestartPrompt = true
    },

    handleRestartPromptAcc: function (value) {
      this.disableHardwareAccelerationToggleValue = value
      this.showRestartPromptAcc = true
    },

    handleSmoothScrolling: function (value) {
      this.showRestartPrompt = false

      if (value === null || value === 'no') {
        this.disableSmoothScrollingToggleValue = !this.disableSmoothScrollingToggleValue
        return
      }

      this.updateDisableSmoothScrolling(
        this.disableSmoothScrollingToggleValue
      ).then(() => {
        // FIXME: No electron safeguard
        const { ipcRenderer } = require('electron')

        ipcRenderer.send('relaunchRequest')
      })
    },

    handleDisableHardwareAcceleration: function (value) {
      this.showRestartPromptAcc = false

      if (value === null || value === 'no') {
        this.disableHardwareAccelerationToggleValue = !this.disableHardwareAccelerationToggleValue
        return
      }

      this.updateDisableHardwareAcceleration(
        this.disableHardwareAccelerationToggleValue
      ).then(() => {
        // FIXME: No electron safeguard
        const { ipcRenderer } = require('electron')

        ipcRenderer.send('relaunchRequest')
      })
    },

    ...mapActions([
      'updateBarColor',
      'updateBaseTheme',
      'updateMainColor',
      'updateSecColor',
      'updateExpandSideBar',
      'updateUiScale',
      'updateDisableSmoothScrolling',
      'updateDisableHardwareAcceleration',
      'updateHideLabelsSideBar'
    ])
  }
})
