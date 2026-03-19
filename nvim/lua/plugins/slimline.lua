-- lua/plugins/slimline.lua
return {
  {
    "sschleemilch/slimline.nvim",
    event = "VeryLazy",
    opts = {
      -- komponenty (w tym git po lewej)
      components = {
        left = { "mode", "path", "git" },
        center = {},
        right = { "diagnostics", "filetype_lsp", "progress" },
      },

      -- RAINBOW + konfiguracja git
      configs = {
        path = {
          hl = {
            primary = "Define",
          },
        },
        git = {
          trunc_width = 120,
          icons = {
            branch = "",
            added = "+",
            modified = "~",
            removed = "-",
          },
          hl = {
            primary = "Function",
          },
        },
        filetype_lsp = {
          hl = {
            primary = "String",
          },
        },
      },
    },
  },

  -- wyłącz statusline używane przez LazyVim
  { "nvim-lualine/lualine.nvim", enabled = false },
  { "rebelot/heirline.nvim", enabled = false },
}

