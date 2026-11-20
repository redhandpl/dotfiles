-- ~/.config/nvim/lua/plugins/colorscheme.lua
return {
  {
    "loctvl842/monokai-pro.nvim",
    lazy = false,           -- ładuj od razu (żeby kolor był od startu)
    priority = 1000,        -- wysoki priorytet, żeby był przed innymi rzeczami
    config = function()
      require("monokai-pro").setup({
        filter = "classic",
        override_palette = function()
          return {
            dark2 = "#171717",
            dark1 = "#282828",
            background = "#171717",
            text = "#ebdbb2",
            accent1 = "#fe4386",
            accent2 = "#fabd2f",
            accent3 = "#fff27f",
            accent4 = "#a6e32d",
            accent5 = "#5ed7ff",
            accent6 = "#be9eff",
            dimmed1 = "#bdae93",
            dimmed2 = "#a89984",
            dimmed3 = "#928374",
            dimmed4 = "#665c54",
            dimmed5 = "#3c3836",
          }
        end,
      })
      vim.cmd.colorscheme("monokai-pro")
    end,
  },
}
