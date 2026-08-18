import { defineCollection, z } from '@nuxt/content'

const createEnum = (options: [string, ...string[]]) => z.enum(options)

const createLinkSchema = () => z.object({
  label: z.string().nonempty(),
  to: z.string().nonempty(),
  icon: z.string().optional().editor({ input: 'icon' }),
  trailingIcon: z.string().optional().editor({ input: 'icon' }),
  size: createEnum(['xs', 'sm', 'md', 'lg', 'xl']).optional(),
  trailing: z.boolean().optional(),
  target: createEnum(['_blank', '_self']).optional(),
  color: createEnum(['primary', 'secondary', 'neutral', 'error', 'warning', 'success', 'info']).optional(),
  variant: createEnum(['solid', 'outline', 'subtle', 'soft', 'ghost', 'link']).optional()
})

export const collections = {
  landing: defineCollection({
    source: 'index.yml',
    type: 'page',
    schema: z.object({
      hero: z.object({
        headline: z.string().optional(),
        links: z.array(createLinkSchema())
      }),
      sponsors: z.object({
        headline: z.string().optional(),
        title: z.string().nonempty(),
        description: z.string().nonempty(),
        items: z.array(z.object({
          img: z.string().nonempty(),
          name: z.string().nonempty(),
          tier: createEnum(['main', 'sponsor', 'exhibitor']).optional(),
          to: z.string().nonempty().optional(),
          target: createEnum(['_blank', '_self']).optional()
        }))
      }),
      program: z.object({
        headline: z.string().optional(),
        title: z.string().nonempty(),
        description: z.string().nonempty(),
        alert: z.object({
          icon: z.string(),
          title: z.string().nonempty(),
          description: z.string().nonempty()
        }),
        schedule: z.object({
          days: z.array(z.object({
            label: z.string().nonempty(),
            slot: z.string().nonempty(),
            tracks: z.array(z.object({
              title: z.string().nonempty(),
              rows: z.array(z.object({
                time: z.string().nonempty(),
                type: createEnum(['break', 'session']).optional(),
                event: z.string().nonempty().optional(),
                speakers: z.array(z.object({
                  name: z.string().nonempty()
                })).optional()
              }))
            }))
          }))
        })
      }),
      callForSpeakers: z.object({
        headline: z.string().optional(),
        title: z.string().nonempty(),
        alert: z.object({
          icon: z.string(),
          title: z.string().nonempty(),
          description: z.string().nonempty()
        }),
        speaker: z.array(z.object({
          img: z.string().optional(),
          name: z.string().optional(),
          role: z.string().optional(),
          title: z.string().nonempty(),
          description: z.string().nonempty(),
          language: z.string().nonempty(),
          country: z.string().nonempty(),
          speakers: z.array(z.object({
            img: z.string().optional(),
            name: z.string().nonempty(),
            role: z.string().optional()
          })).optional()
        }).refine(
          value => Boolean(value.speakers?.length || (value.img && value.name && value.role)),
          {
            message: 'Provide either img/name/role or a speakers array'
          }
        ))
      }),
      workshops: z.object({
        headline: z.string().optional(),
        title: z.string().nonempty(),
        description: z.string().nonempty(),
        highlights: z.array(z.object({
          title: z.string().nonempty(),
          description: z.string().nonempty()
        })),
        registration: z.object({
          title: z.string().nonempty(),
          description: z.string().nonempty(),
          mail: z.string().nonempty(),
          subject: z.string().nonempty()
        })
      }),
      tickets: z.object({
        headline: z.string().optional(),
        title: z.string().nonempty(),
        description: z.string().nonempty(),
        callout: z.object({
          title: z.string().nonempty(),
          description: z.string().nonempty()
        }),
        pricing: z.array(z.object({
          title: z.string().nonempty(),
          description: z.string().nonempty(),
          price: z.string().nonempty(),
          highlight: z.boolean().optional(),
          billingCycle: z.string().optional(),
          button: z.object({
            label: z.string().nonempty(),
            to: z.string().nonempty(),
            target: createEnum(['_blank', '_self']).optional()
          }),
          badge: z.string().optional(),
          terms: z.string().optional()
        }))
      }),
      faq: z.object({
        headline: z.string().optional(),
        title: z.string().nonempty(),
        items: z.array(z.object({
          icon: z.string().optional(),
          label: z.string().nonempty(),
          content: z.string().nonempty()
        }))
      }),
      contact: z.object({
        headline: z.string().optional(),
        title: z.string().nonempty(),
        team: z.array(z.object({
          img: z.string().nonempty(),
          name: z.string().nonempty(),
          role: z.string().nonempty().optional()
        })).optional(),
        info: z.object({
          title: z.string().nonempty(),
          mail: z.string().nonempty()
        })
      }),
      partners: z.object({
        headline: z.string().optional(),
        title: z.string().nonempty(),
        items: z.array(z.object({
          img: z.string().nonempty(),
          name: z.string().nonempty(),
          to: z.string().nonempty().optional(),
          target: createEnum(['_blank', '_self']).optional()
        })),
        hosts: z.array(z.object({
          img: z.string().nonempty(),
          name: z.string().nonempty(),
          to: z.string().nonempty().optional(),
          target: createEnum(['_blank', '_self']).optional()
        })),
        callout: z.object({
          description: z.string().nonempty()
        }).optional()
      })
    })
  }),
  general: defineCollection({
    source: 'general.yml',
    type: 'page',
    schema: z.object({
      overview: z.object({
        title: z.string().nonempty(),
        description: z.string().nonempty(),
        button: z.object({
          icon: z.string(),
          title: z.string().nonempty(),
          to: z.string().nonempty(),
          target: createEnum(['_blank', '_self']).optional()
        }),
        internationalButton: z.object({
          icon: z.string(),
          title: z.string().nonempty(),
          to: z.string().nonempty(),
          target: createEnum(['_blank', '_self']).optional()
        })
      })
    })
  }),
  history: defineCollection({
    source: 'history.yml',
    type: 'page',
    schema: z.object({
      history: z.object({
        title: z.string().nonempty(),
        description: z.string().nonempty(),
        items: z.array(z.object({
          date: z.string().nonempty(),
          icon: z.string().nonempty(),
          title: z.string().nonempty(),
          description: z.string().nonempty()
        }))
      })
    })
  }),
  year: defineCollection({
    source: '2026.yml',
    type: 'page',
    schema: z.object({
      ircp2026: z.object({
        headline: z.string().optional(),
        title: z.string().nonempty(),
        description: z.string().nonempty()
      })
    })
  }),
  travelStay: defineCollection({
    source: 'travel-stay.yml',
    type: 'page',
    schema: z.object({
      headline: z.string().optional(),
      arrival: z.object({
        train: z.object({
          title: z.string().nonempty(),
          description: z.string().nonempty(),
          img: z.string().nonempty()
        }),
        plane: z.object({
          title: z.string().nonempty(),
          description: z.string().nonempty(),
          img: z.string().nonempty(),
          airports: z.array(z.object({
            name: z.string().nonempty(),
            distance: z.string().nonempty()
          }))
        })
      })
    })
  }),
  venue: defineCollection({
    source: 'venue.yml',
    type: 'page',
    schema: z.object({
      venue: z.object({
        title: z.string().nonempty(),
        description: z.string().nonempty(),
        address: z.string().nonempty()
      })
    })
  }),
  regensburg: defineCollection({
    source: 'regensburg.yml',
    type: 'page',
    schema: z.object({
      regensburg: z.object({
        title: z.string().nonempty(),
        description: z.string().nonempty(),
        callout: z.object({
          title: z.string().nonempty(),
          description: z.string().nonempty()
        })
      })
    })
  })
}
