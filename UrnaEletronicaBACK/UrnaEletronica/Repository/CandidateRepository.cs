using UrnaEletronica.Model;
using System.Linq;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System;
using Microsoft.AspNetCore.Http;
using UrnaEletronica.Data;

namespace UrnaEletronica.Repository
{
    public class CandidateRepository : ICandidateRepository
    {
        private readonly DbAcess _context;

        public CandidateRepository(DbAcess context)
        {
            _context = context;
        }

        public async Task InsertCandidate(Candidate candidate)
        {
            await _context.Candidate.AddAsync(candidate);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteCandidate(Candidate candidate)
        {
            _context.Remove(candidate);
            await _context.SaveChangesAsync();   
        }

        public async Task<Candidate> GetCandidateByLabel(CandidateDelete candidateDelete)
        {

            return await _context.Candidate.AsNoTracking().FirstOrDefaultAsync(l => l.Label == candidateDelete.Label);
        }
    }
}
