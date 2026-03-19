-- ~/.config/nvim/lua/plugins/colorscheme.lua
return {
  {
    "loctvl842/monokai-pro.nvim",
    lazy = false,           -- ładuj od razu (żeby kolor był od startu)
    priority = 1000,        -- wysoki priorytet, żeby był przed innymi rzeczami
    config = function()
      require("monokai-pro").setup({
        filter = "classic",
    })
      vim.cmd.colorscheme("monokai-pro")  -- ustawienie schematu
    end,
  },
}
